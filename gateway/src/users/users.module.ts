import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), '..', 'proto/auth.proto'),
          // url: 'localhost:50051',
          url: `0.0.0.0:5051`,
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
  controllers: [UsersController],
  // providers: [UsersService],
})
export class UsersModule {}
