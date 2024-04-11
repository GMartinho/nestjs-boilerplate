import { DeleteObjectCommandInput, DeleteObjectCommandOutput, GetObjectCommandInput, GetObjectCommandOutput, ListObjectsV2CommandInput, ListObjectsV2CommandOutput, PutObjectCommandInput, PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { FileStorageClient } from '../file-storage.shared';
import { Environment } from 'src/env/environment';

@Injectable()
export class AwsS3Client implements FileStorageClient {
    private readonly s3: S3;

    constructor(private readonly env: Environment) {
        const { bucket } = env;

        this.s3 = new S3({
            apiVersion: bucket.apiVersion,
            region: bucket.region
        });
    }

    async upload(bucket: string, key: string, buffer: Buffer): Promise<PutObjectCommandOutput> {
        const params: PutObjectCommandInput = {
            Bucket: bucket,
            Body: buffer,
            Key: key
        }

        return this.s3.putObject(params);
    }

    async list(bucket: string, prefix: string, limit: number = 10): Promise<ListObjectsV2CommandOutput> {
        const params: ListObjectsV2CommandInput = {
          Bucket: bucket,
          MaxKeys: limit,
          Prefix: `${prefix}/`,
          Delimiter: '/'
        }
    
        return this.s3.listObjectsV2(params);
    }

    async get(bucket: string, key: string): Promise<GetObjectCommandOutput> {
        const params: GetObjectCommandInput = {
          Bucket: bucket,
          Key: key
        }
    
        return this.s3.getObject(params);
    }

    async delete(bucket: string, key: string): Promise<DeleteObjectCommandOutput> {
        const params: DeleteObjectCommandInput = {
          Bucket: bucket,
          Key: key
        }
    
        return this.s3.deleteObject(params);
    }

}