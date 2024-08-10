import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArzaModule } from './arza/arza.module';
import { PrismaClientModule } from './prisma-client/prisma-client.module';

@Module({
  imports: [ArzaModule, PrismaClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
