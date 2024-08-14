import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { ArzaModule } from './arza/arza.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'auth',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), '..', 'proto/auth.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
    UsersModule,
    PrismaClientModule,
    ArzaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
