import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/app.config';
import { v4 as uuid } from 'uuid';
import { FileStorageClient } from './file-storage-client.interface';

@Injectable()
export class FileStorageService {
  constructor(private readonly appConfig: AppConfig, private readonly bucketClient: FileStorageClient) {}

  async create(user_account_id: string, file, path: string, bucket_name: string) {
    const { buffer, originalname } = file;

    const filePath: string = `${user_account_id}${path ? `/${path}` : ''}`;

    const fileKey: string =  `${filePath}/${uuid()}:${originalname}`;
    
    const uploadedFile = await this.bucketClient.upload(bucket_name, fileKey, buffer)

    return [fileKey, uploadedFile['Location']];
  }

  async findAll(user_id: string, bucket: string, parent_id?: number) {
    const folderPrefix: string = parent_id ? `${user_id}/${parent_id}` : `${user_id}`;

    const bucketEnv: string = this.appConfig.bucket.name;

    const bucketProviderEnv: string = this.appConfig.bucketProvider;

    const fileObjects = await this.bucketClient.list(folderPrefix, bucketEnv);

    const fileUrls = {};

    for(let i = 0; i < fileObjects.Contents.length; i++) {
      fileUrls[fileObjects.Contents[i].Key] = encodeURI(`https://${bucketEnv}.${bucketProviderEnv}/${fileObjects.Contents[i].Key}`);
    }

    return fileUrls;
  }

  async findOne(key: string, bucket: string) {
    const bucketEnv: string = this.appConfig.bucket.name;

    const bucketProviderEnv: string = this.appConfig.bucketProvider;

    const fileObject = await this.bucketClient.get(key, bucketEnv);

    const fileUrl: string = fileObject ? `https://${bucketEnv}.${bucketProviderEnv}/${key}` : null;

    return fileUrl;
  }

  async update(user_id: string, file, bucket: string, parent_id?: number) {
    const { buffer, originalname } = file;

    const fileKey: string =  parent_id ? `${user_id}/${parent_id}/${uuid()}:${originalname}` : `${user_id}/${uuid()}:${originalname}`;

    const bucketEnv: string = this.appConfig.bucket.name;

    return await this.bucketClient.upload(bucketEnv, fileKey, buffer).then((response) => {
        const fileLocation = response['Location'];
        return [fileKey, fileLocation];
      }).catch((error) => {
        throw new HttpException('The service responsible to persist your file is currently unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      });
  }

  async remove(id: number) {
    return `This action removes a #${id} awsS3`;
  }
}
