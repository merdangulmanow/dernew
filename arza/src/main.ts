import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const PORT =  parseInt(process.env.PORT) || 5000;
  const logger = new Logger();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        // url: 'localhost:50051',
        url: `0.0.0.0:5050`,
        package: 'arza',
        protoPath: join(process.cwd(), 'proto/arza.proto'),
        loader: {
          json: true,
          keepCase: true,
          longs: Number,
          enums: String,
          defaults: false,
          arrays: true,
          objects: true,
          includeDirs: [join(process.cwd(), 'proto')],
        },
      },
    },
  );
  await app.listen();
  logger.debug(`Started GRPC server on ${PORT}`);
}
bootstrap();
