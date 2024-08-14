import { Module } from '@nestjs/common';
import { ArzaController } from './arza.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'arza',
        transport: Transport.GRPC,
        options: {
          package: 'arza',
          protoPath: join(process.cwd(), '..', 'proto/arza.proto'),
          /*
          protoPath: [
            resolve('../protos/service/hero.proto'),
            resolve('../protos/service/vehicle.proto'),
          ],
          url: 'localhost:50051',
          */
          url: `0.0.0.0:5050`,
          loader: {
            keepCase: true,
            longs: Number,
            enums: String,
            defaults: false,
            arrays: true,
            objects: true,
            includeDirs: [join(process.cwd(), '..', 'proto')],
          },
          // url: 'https://b6a4cd09.ngrok.io/',
        },
      },
    ]),
  ],
  controllers: [ArzaController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
  ],
})
export class ArzaModule {}
