import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        
        package: 'auth',
        protoPath: join(process.cwd(), '..', 'proto/auth.proto'),
        url: 'localhost:5051',
        loader: {
          keepCase: true,
          longs: Number,
          enums: String,
          defaults: false,
          arrays: true,
          objects: true,
          includeDirs: [join(process.cwd(), 'proto')],
        },
        // url: 'https://b6a4cd09.ngrok.io/',
        // loader: {
        //   includeDirs: [join(process.cwd(), 'proto')],
        // },
      },
    },
  );
  await app.listen();
}
bootstrap();
