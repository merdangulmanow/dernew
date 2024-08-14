import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './filters/rpc-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = Number(process.env.PORT) || 9090;
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: true,
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            statusCode: HttpStatus.NOT_ACCEPTABLE,
            success: false,
            message: errors[0],
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      },
    }),
  );
  // app.useGlobalFilters(new RpcExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(PORT);
  console.log(`app running on ${PORT}`);
}
bootstrap();
