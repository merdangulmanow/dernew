import { Arza, Arzalar, CreateArzaDto, FindAllDto, FindOneArzaDto } from './arza';
import { PrismaClientService } from '@/prisma-client/prisma-client.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { Timestamp } from "./google/protobuf/timestamp";
import { plainToInstance } from 'class-transformer';
import { arzaResponse } from '@/response/arza.response';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from 'generated/client';

@Injectable()
export class ArzaService implements OnModuleInit {
  constructor(private readonly prismaClient: PrismaClientService){}
  private readonly arzalar: Arza[] = [];
  onModuleInit() {
  }
  
  async createArza(request: CreateArzaDto): Promise<Arza> {    
    try {
      let item= await this.prismaClient.statement.create({
        data: {
          ...request, executedDate: new Date(request.executedDate), workedDate: new Date(request.workedDate),
          recivedDate: new Date(request.recivedDate), executorRecivedDate: new Date(request.executorRecivedDate),
          status: 'newly'
        }
      })
      const date: Timestamp = {nanos: 1, seconds: 2}
      return plainToInstance(arzaResponse, item) 
    } catch (err) {
      console.log(err)
      throw new RpcException({ code: 101, message: 'some text data' });
    }
  }

  async findAllArza(dto: FindAllDto): Promise<Arzalar> {
    let pageSize: number = dto.pageSize || 10;
    let page: number = dto.page || 1;
    const skip: number = page * pageSize - pageSize;
    let whereInput: Prisma.statementWhereInput = {
      deletedAt: null,
      recivedNumber: {contains: dto?.recivedNumber, mode: 'insensitive' },
      applicant: {contains: dto?.applicant, mode: 'insensitive'},
      status: {contains: dto?.status?.toString(), mode: 'insensitive'},
    }
    if(dto?.recivedDate){
      whereInput = {...whereInput, recivedDate: new Date(dto?.recivedDate)}
    }
    const count= await this.prismaClient.statement.count({where: whereInput})
    const rows= await this.prismaClient.statement.findMany({
      where: whereInput,
      orderBy: {createdAt: 'desc'},
      take: pageSize,
      skip: skip
    })
    const newly= await this.prismaClient.statement.count({where: {...whereInput, status: 'newly'}})
    const delay= await this.prismaClient.statement.count({where: {...whereInput, status: 'delay'}})
    console.log({delay, newly})
    return {count: count, rows: plainToInstance(arzaResponse, rows)}
    // const arza
  }

  findOneArza(request: FindOneArzaDto): Arza | Promise<Arza> {
    return this.arzalar[0];
  }

  removeArza(request: FindOneArzaDto): Arza | Promise<Arza> {
    return this.arzalar[0];
  }
}