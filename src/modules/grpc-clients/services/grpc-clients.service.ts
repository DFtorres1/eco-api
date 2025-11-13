import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

interface ModelService {
  processImage(data: {
    request_id: string;
    image: Buffer;
    model_name: string;
  }): Observable<any>;
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

  async callModel(
    modelName: string,
    image: Buffer,
    requestId: string,
  ): Promise<any> {
    const data = { request_id: requestId, image, model_name: modelName };
    const service = this.services.get(modelName);
    if (!service) throw new Error(`Model service not found: ${modelName}`);

    const response$ = service.processImage(data);
    return await lastValueFrom(response$);
  }
}
