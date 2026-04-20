import { Configuration, Value } from '@itgorillaz/configify';
import { IsOptional, IsString } from 'class-validator';

@Configuration()
export class AzureConfig {
  @IsString()
  @Value('AZURE_STORAGE_CONNECTION_STRING')
  storageConnectionString: string;

  @IsString()
  @Value('AZURE_STORAGE_CONTAINER_NAME')
  containerName: string;

  @IsString()
  @Value('WEBHOOK_SECRET')
  webhookSecret: string;

  @IsString()
  @Value('PDF2IMG_URL')
  pdf2imgUrl: string;

  @IsString()
  @Value('LIBREOFFICE_URL')
  libreofficeUrl: string;

  @IsOptional()
  @IsString()
  @Value('BLOB_PATH_PREFIX')
  blobPathPrefix?: string;
}
