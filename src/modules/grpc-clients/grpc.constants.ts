import {
  ClientProviderOptions,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

type ModelPropertires = {
  name: string;
  transport: Transport;
  options: {
    package: string;
    protoPath: string | string[];
    url: string;
  };
};

export const Models: Record<string, ModelPropertires> = {
  MODEL_A: {
    name: 'MODEL_A',
    transport: Transport.GRPC,
    options: {
      package: 'model',
      protoPath: join(__dirname, 'proto/model.proto'),
      url: 'localhost:50051',
    },
  },
  MODEL_B: {
    name: 'MODEL_B',
    transport: Transport.GRPC,
    options: {
      package: 'model',
      protoPath: join(__dirname, 'proto/model.proto'),
      url: 'localhost:50051',
    },
  },
};

export const ModelsServers: ClientsModuleOptions = Object.values(Models).map(
  (model) => {
    return {
      name: model.name,
      transport: model.transport,
      options: {
        package: model.options.package,
        protoPath: model.options.protoPath,
        url: model.options.url,
      },
    } as ClientProviderOptions;
  },
);
