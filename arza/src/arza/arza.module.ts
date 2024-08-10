import { Module } from '@nestjs/common';
import { ArzaService } from './arza.service';
import { ArzaController } from './arza.controller';
import { PrismaClientModule } from '@/prisma-client/prisma-client.module';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';

@Module({
  controllers: [ArzaController],
  providers: [
    ArzaService,
    // {
    //   provide: APP_FILTER,
    //   useClass: GrpcServerExceptionFilter,
    // },
  ],
  imports: [PrismaClientModule]
})
export class ArzaModule {}
