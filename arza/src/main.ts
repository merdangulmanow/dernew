import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const PORT = parseInt(process.env.PORT) || 5000;
  const logger = new Logger();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        // url: 'localhost:50051',
        url: `0.0.0.0:5050`,
        package: 'arza',
        protoPath: join(process.cwd(), '..', 'proto/arza.proto'),
        loader: {
          json: true,
          keepCase: true,
          oneofs: true,
          alternateCommentMode: true,
          longs: String,
          enums: String,
          defaults: true,
          arrays: true,
          objects: true,
          includeDirs: [join(process.cwd(), '..', 'proto')],
          /*
          includeDirs: [join(process.cwd(), '..', 'proto')],
          arrays: true,
          enums: String,
          */
        },
      },
    },
  );
  await app.listen();
  logger.debug(`Started GRPC server on ${PORT}`);
}
bootstrap();
