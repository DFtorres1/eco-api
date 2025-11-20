import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';

interface ModelService {
  ProcessImage(data: { imageBuffer: Buffer }): Observable<{
    accuracy: number;
    executionTime: number;
    hardware: string;
  }>;
}

@Injectable()
export class GrpcClientService implements OnModuleInit {
  private readonly services = new Map<string, ModelService>();

  constructor(
    @Inject('MODEL_A') private readonly modelAClient: ClientGrpc,
    @Inject('MODEL_B') private readonly modelBClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.services.set(
      'MODEL_A',
      this.modelAClient.getService<ModelService>('ModelService'),
    );
    this.services.set(
      'MODEL_B',
      this.modelBClient.getService<ModelService>('ModelService'),
    );
  }

  async callModel(modelName: string, image: Buffer): Promise<any> {
    const service = this.services.get(modelName);
    if (!service) throw new Error(`Model service not found: ${modelName}`);

    const response$ = service.ProcessImage({ imageBuffer: image });
    return await lastValueFrom(response$);
  }
}