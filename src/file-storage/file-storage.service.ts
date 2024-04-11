import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FileStorageClient } from './file-storage.shared';
import { randomUUID } from 'crypto';
import { Environment } from '../env/environment';

@Injectable()
export class FileStorageService {
  constructor(
    @Inject('FILE_STORAGE_CLIENT') private fileStorage: FileStorageClient,
    private readonly env: Environment,
  ) {}

  set fileStorageClient(fileStorage: FileStorageClient) {
    this.fileStorage = fileStorage;
  }

  async create(file, userId: string, bucketName: string, path?: string) {
    const { buffer, originalname } = file;

    const filePath: string = `${userId}${path ? `/${path}` : ''}`;

    const fileKey: string = `${filePath}/${randomUUID()}:${originalname}`;

    const uploadedFile = await this.fileStorage.upload(bucketName, fileKey, buffer);

    return [fileKey, uploadedFile['Location']];
  }

  async findMany(user_id: string, bucket: string, parent_id?: number) {
    const folderPrefix: string = parent_id ? `${user_id}/${parent_id}` : `${user_id}`;

    const bucketEnv: string = this.env.bucket.name;

    const bucketProviderEnv: string = this.env.bucketProvider;

    const fileObjects = await this.fileStorage.list(folderPrefix, bucketEnv);

    const fileUrls = {};

    /* for(let i = 0; i < fileObjects.Contents.length; i++) {
      fileUrls[fileObjects.Contents[i].Key] = encodeURI(`https://${bucketEnv}.${bucketProviderEnv}/${fileObjects.Contents[i].Key}`);
    } */

    return fileUrls;
  }

  async findOne(key: string, bucket: string) {
    const bucketEnv: string = this.env.bucket.name;

    const bucketProviderEnv: string = this.env.bucketProvider;

    const fileObject = await this.fileStorage.get(key, bucketEnv);

    const fileUrl: string = fileObject ? `https://${bucketEnv}.${bucketProviderEnv}/${key}` : null;

    return fileUrl;
  }

  async update(user_id: string, file, bucket: string, parent_id?: number) {
    const { buffer, originalname } = file;

    const fileKey: string = parent_id ? `${user_id}/${parent_id}/${randomUUID()}:${originalname}` : `${user_id}/${randomUUID()}:${originalname}`;

    const bucketEnv: string = this.env.bucket.name;

    return await this.fileStorage
      .upload(bucketEnv, fileKey, buffer)
      .then(response => {
        const fileLocation = response['Location'];
        return [fileKey, fileLocation];
      })
      .catch(error => {
        throw new HttpException('The service responsible to persist your file is currently unavailable', HttpStatus.SERVICE_UNAVAILABLE);
      });
  }

  async remove(id: number) {
    return `This action removes a #${id} awsS3`;
  }
}
