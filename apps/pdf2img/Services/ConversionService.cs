using System.Text;
using System.Text.Json;
using PDFtoImage;
using SkiaSharp;

namespace pdf2img.Services;

public class ConversionService(
  AzureBlobService azureBlobService,
  IHttpClientFactory httpClientFactory,
  IConfiguration configuration,
  ILogger<ConversionService> logger)
{
  private const int Dpi = 150;
  private const int WebpQuality = 70;
  private readonly string blobPathPrefix = (configuration["BLOB_PATH_PREFIX"] ?? string.Empty).Trim('/');
  private readonly string webhookUrl = configuration["NESTJS_WEBHOOK_URL"]
    ?? throw new InvalidOperationException("NESTJS_WEBHOOK_URL is not configured.");
  private readonly string webhookSecret = configuration["WEBHOOK_SECRET"]
    ?? throw new InvalidOperationException("WEBHOOK_SECRET is not configured.");

  public async Task ProcessAsync(byte[] pdfBytes, int fileId, int userId, string storageKey)
  {
    var base64 = Convert.ToBase64String(pdfBytes);
    string? thumbnailUrl = null;
    string? pdfBlobPath = null;
    string? pdfBlobUrl = null;
    var pageCount = 0;

    try
    {
      pageCount = Conversion.GetPageCount(base64);
      for (var pageIndex = 0; pageIndex < pageCount; pageIndex++)
      {
        logger.LogInformation(
          "Converting page {Page}/{PageCount} for fileId={FileId} userId={UserId}.",
          pageIndex + 1,
          pageCount,
          fileId,
          userId);

        using var image = Conversion.ToImage(base64, pageIndex, options: new(Dpi));
        await using var encodedImage = image.Encode(SKEncodedImageFormat.Webp, WebpQuality).AsStream();

        var pageFile = $"{pageIndex + 1:D3}.webp";
        var blobPath = BuildBlobPath(storageKey, "images", pageFile);
        var uploadedUrl = await azureBlobService.UploadAsync(blobPath, encodedImage, "image/webp");

        thumbnailUrl ??= uploadedUrl;
      }

      using var pdfStream = new MemoryStream(pdfBytes);
      pdfBlobPath = BuildBlobPath(storageKey, "pdfs", "source.pdf");
      pdfBlobUrl = await azureBlobService.UploadAsync(pdfBlobPath, pdfStream, "application/pdf");

      await SendWebhookAsync(new
      {
        fileId,
        userId,
        status = "ready",
        pageCount,
        thumbnailUrl,
        blobUrl = pdfBlobUrl,
        blobPath = pdfBlobPath,
      });

      logger.LogInformation("Completed conversion for fileId={FileId} userId={UserId}.", fileId, userId);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Failed conversion for fileId={FileId} userId={UserId}.", fileId, userId);

      await SendWebhookAsync(new
      {
        fileId,
        userId,
        status = "failed",
        pageCount,
        error = ex.Message,
        blobUrl = pdfBlobUrl,
        blobPath = pdfBlobPath,
      });
    }
  }

  private async Task SendWebhookAsync(object payload)
  {
    var client = httpClientFactory.CreateClient("webhook");
    using var request = new HttpRequestMessage(HttpMethod.Post, $"{webhookUrl.TrimEnd('/')}/webhooks/file-processed");
    request.Headers.Add("x-webhook-secret", webhookSecret);
    request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

    using var response = await client.SendAsync(request);
    if (!response.IsSuccessStatusCode)
    {
      var content = await response.Content.ReadAsStringAsync();
      logger.LogError(
        "Webhook failed with status {StatusCode}. Response: {ResponseBody}",
        (int)response.StatusCode,
        content);
    }
  }

  private string BuildBlobPath(string storageKey, string folder, string fileName)
  {
    if (string.IsNullOrWhiteSpace(storageKey))
    {
      throw new InvalidOperationException("storageKey is required.");
    }

    return string.IsNullOrWhiteSpace(blobPathPrefix)
      ? $"{storageKey}/{folder}/{fileName}"
      : $"{blobPathPrefix}/{storageKey}/{folder}/{fileName}";
  }
}
