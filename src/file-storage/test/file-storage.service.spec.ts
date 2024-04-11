import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageService } from '../file-storage.service';
import { GCloudStorageClient } from '../client/gcloud-storage.client';

describe('FileStorageService', () => {
  let service: FileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileStorageService],
    }).compile();

    service = module.get<FileStorageService>(FileStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should change client used in service', () => {
    const buffer = Buffer.from('dados do buffer aqui');
    service.create(buffer, 'abc', 'blabla', 'oi');
    service.fileStorageClient = new GCloudStorageClient();
    service.create(buffer, 'abc', 'blabla', 'oi');

    expect(service).toBeDefined();
  });
});
