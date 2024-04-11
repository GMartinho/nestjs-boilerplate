import { Injectable } from "@nestjs/common";
import { FileStorageClient } from "../file-storage.shared";

@Injectable()
export class GCloudStorageClient implements FileStorageClient {
    upload(bucket: string, key: string, buffer: Buffer): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    list(bucket: string, prefix: string, limit?: number): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    get(bucket: string, key: string): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    delete(bucket: string, key: string): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
}