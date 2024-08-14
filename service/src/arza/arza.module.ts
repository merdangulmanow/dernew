import { Global, Module } from '@nestjs/common';
import { ArzaService } from './arza.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'arza',
        transport: Transport.GRPC,
        options: {
          package: 'arza',
          protoPath: join(process.cwd(), '..', 'proto/arza.proto'),
          url: `0.0.0.0:5050`,
          loader: {
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
    ]),
  ],
  // controllers: [ArzaController],
  providers: [ArzaService],
  exports: [ArzaService],
})
export class ArzaModule {}
