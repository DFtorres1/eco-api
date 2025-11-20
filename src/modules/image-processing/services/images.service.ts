import { Injectable } from '@nestjs/common';
import { ImageGateway } from '../websocket/image.gateway';
import { GrpcClientService } from 'src/modules/grpc-clients/services/grpc-clients.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ImageService {
  constructor(
    private readonly grpcClient: GrpcClientService,
    private readonly gateway: ImageGateway,
  ) {}

  async testModelA() {
    const fs = require('fs');
    const img = fs.readFileSync('test.jpg');
    const result = await this.grpcClient.callModel('MODEL_A', img);
    return result;
  }

  async processImage(
    imageBuffer: Buffer,
    clientId: string,
    models: string[],
  ): Promise<{ message: string }> {
    const promises = models.map(async (modelName) => {
      try {
        const id = randomUUID();
        const result = await this.grpcClient.callModel(modelName, imageBuffer);
        this.gateway.sendPartialResult(clientId, modelName, result);
        return { modelName, result };
      } catch (err) {
        this.gateway.sendPartialResult(clientId, modelName, {
          error: err.message,
        });
        return { modelName, error: err.message };
      }
    });

    const allResults = await Promise.all(promises);
    const comparison = this.compareResults(allResults);

    this.gateway.sendFinalResult(clientId, comparison);
    return { message: 'Processing started. Results will be streamed.' };
  }

  private compareResults(results: any[]) {
    // Example: choose best accuracy
    const best = results.reduce((best, r) =>
      (r.result?.accuracy || 0) > (best.result?.accuracy || 0) ? r : best,
    );
    return { bestModel: best.modelName, accuracy: best.result?.accuracy };
  }
}
