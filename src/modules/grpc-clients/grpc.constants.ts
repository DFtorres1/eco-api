import {
  ClientProviderOptions,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

export enum RecognitionTypes {
  OBJECTS = 'OBJECTS',
  CODES = 'CODES',
  TEXT = 'TEXT',
}

export type ModelPropertires = {
  name: string;
  transport: Transport;
  recognizes: RecognitionTypes;
  options: {
    package: string;
    protoPath: string | string[];
    url: string;
  };
};

const sharedOptions = {
  package: 'model',
  protoPath: join(__dirname, 'proto/model.proto'),
};

export const Models: ModelPropertires[] = [
  {
    name: 'YOLOv8n',
    transport: Transport.GRPC,
    recognizes: RecognitionTypes.OBJECTS,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'YOLOv5n',
    recognizes: RecognitionTypes.OBJECTS,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'EfficientDet',
    recognizes: RecognitionTypes.OBJECTS,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'MobileNet',
    recognizes: RecognitionTypes.OBJECTS,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'PaddleOCR',
    recognizes: RecognitionTypes.TEXT,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'EasyOCR',
    recognizes: RecognitionTypes.TEXT,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'TesseractOCR',
    recognizes: RecognitionTypes.TEXT,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'CRAFTCRNN',
    recognizes: RecognitionTypes.TEXT,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'ZBar',
    recognizes: RecognitionTypes.CODES,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'ZXing',
    recognizes: RecognitionTypes.CODES,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
  {
    name: 'pybarcode',
    recognizes: RecognitionTypes.CODES,
    transport: Transport.GRPC,
    options: {
      ...sharedOptions,
      url: 'localhost:50051',
    },
  },
];

export const ModelsServers: ClientsModuleOptions = Models.map((model) => {
  return {
    name: model.name,
    transport: model.transport,
    options: {
      package: model.options.package,
      protoPath: model.options.protoPath,
      url: model.options.url,
    },
  } as ClientProviderOptions;
});
