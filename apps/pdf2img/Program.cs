using pdf2img.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<AzureBlobService>();
builder.Services.AddSingleton<ConversionService>();
builder.Services.AddHttpClient("webhook");

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapPost("/convert", async (
  HttpRequest request,
  ConversionService conversionService,
  int fileId,
  int userId,
  string storageKey,
  ILogger<Program> logger) =>
{
  await using var stream = new MemoryStream();
  await request.Body.CopyToAsync(stream);
  var pdfBytes = stream.ToArray();
  if (pdfBytes.Length == 0)
  {
    return Results.BadRequest(new { message = "PDF payload is required in the request body." });
  }

  _ = Task.Run(async () =>
  {
    try
    {
      await conversionService.ProcessAsync(pdfBytes, fileId, userId, storageKey);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Unhandled processing error for file {FileId} and user {UserId}.", fileId, userId);
    }
  });

  return Results.Accepted();
});

app.Run();
