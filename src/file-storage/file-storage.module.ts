import { Global, Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { AwsS3Client } from './aws-s3/aws-s3.client';

@Global()
@Module({
  providers: [FileStorageService, AwsS3Client],
  exports: [FileStorageService]
})
export class FileStorageModule {}
