import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from 'src/config/environment';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Vision Gateway API')
      .setDescription('API for interacting with image models')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.enableCors({
      origin: '*',
      methods: 'GET,POST',
      allowedHeaders: 'Content-Type,Authorization',
    });

    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // const modelService = app.connectMicroservice<MicroserviceOptions>({
    //   transport: Transport.GRPC,
    //   options: {
    //     package: 'model', // name of the package in your proto
    //     protoPath: join(__dirname, './proto/model.proto'),
    //     url: '0.0.0.0:50051', // gRPC server address of the model service
    //   },
    // });

    // await app.startAllMicroservices();
    await app.listen(PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Watch for the Docs on: ${await app.getUrl()}/docs`);
    // console.log(`Active microservices: ${await app.getMicroservices()}`);
  } catch (error) {
    console.error('Error during application bootstrap: ', error);
    process.exit(1);
  }
}

void bootstrap();
