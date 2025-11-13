import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcClientService } from './services/grpc-clients.service';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MODEL_A',
        transport: Transport.GRPC,
        options: {
          package: 'model',
          protoPath: join(__dirname, 'proto/model.proto'),
          url: 'localhost:50051',
        },
      },
      {
        name: 'MODEL_B',
        transport: Transport.GRPC,
        options: {
          package: 'model',
          protoPath: join(__dirname, 'proto/model.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class GrpcClientModule {}
