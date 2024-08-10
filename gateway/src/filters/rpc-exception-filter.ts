import { Catch, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    response.status(400).json({
        statusCode: exception['code'],
        success: false,
        message: exception['message'],
        data: null,
        timestamp: new Date().toISOString(),
        path: request.url,
    });

    return {staus: exception, error: 'RpcFilterError'};
  }
}