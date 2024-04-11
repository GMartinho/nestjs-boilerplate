import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { AwsS3Client } from './client/aws-s3.client';

@Module({
  providers: [
    FileStorageService,
    {
      provide: 'FILE_STORAGE_CLIENT',
      useClass: AwsS3Client,
    },
  ],
  exports: [FileStorageService],
})
export class FileStorageModule {}
