export interface FileStorageClient {
    upload(bucket: string, key: string, buffer: Buffer): Promise<unknown>
    list(bucket: string, prefix: string, limit?: number): Promise<unknown>
    get(bucket: string, key: string): Promise<unknown>
    delete(bucket: string, key: string): Promise<unknown>
}