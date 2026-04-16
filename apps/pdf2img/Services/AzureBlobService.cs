using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace pdf2img.Services;

public class AzureBlobService
{
  private readonly BlobContainerClient containerClient;

  public AzureBlobService(IConfiguration configuration)
  {
    var connectionString = configuration["AZURE_STORAGE_CONNECTION_STRING"]
      ?? throw new InvalidOperationException("AZURE_STORAGE_CONNECTION_STRING is not configured.");
    var containerName = configuration["AZURE_STORAGE_CONTAINER_NAME"]
      ?? throw new InvalidOperationException("AZURE_STORAGE_CONTAINER_NAME is not configured.");

    containerClient = new BlobContainerClient(connectionString, containerName);
  }

  public async Task<string> UploadAsync(string blobPath, Stream content, string contentType)
  {
    var blobClient = containerClient.GetBlobClient(blobPath);
    await blobClient.UploadAsync(
      content,
      new BlobHttpHeaders
      {
        ContentType = contentType,
        CacheControl = "max-age=86400",
      });

    return blobClient.Uri.ToString();
  }
}
