import {
  Arza,
  Arzalar,
  // arzaStatus,
  CreateArzaDto,
  CreateDismantleDto,
  FindAllDto,
  FindOneArzaDto,
  Resolution,
  WorkSet,
  WorkSetDto,
} from './arza';
import { PrismaClientService } from '@/prisma-client/prisma-client.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { arzaResponse } from '@/response/arza.response';
import { RpcException } from '@nestjs/microservices';
import { arzaStatusEnum, Prisma, wokrTypeEnum } from 'generated/client';
import { randomInt } from 'crypto';

@Injectable()
export class ArzaService implements OnModuleInit {
  constructor(private readonly prismaClient: PrismaClientService) {}
  onModuleInit() {}

  async createArza(dto: CreateArzaDto): Promise<Arza> {
    try {
      let arza = await this.prismaClient.umumyArzalar.upsert({
        where: { id: dto.id },
        create: {
          descrtiption: dto.descrtiption,
          registredNumber: randomInt(10, 9999),
          created: dto?.created ? new Date(dto.created) : new Date(),
          files: dto.files.map((item) => {
            return { ...item };
          }),
          createdBy: dto.createdBy,
          applicants: {
            create: dto.applicants.map((item) => {
              return {
                lastname: item.lastname,
                name: item.name,
                passportNumber: Number(item.passportNumber),
                passportSeriya: item.passportSeriya,
                createdBy: dto.createdBy,
                deleted: null,
              };
            }),
          },
        },
        update: {
          descrtiption: dto.descrtiption,
          files: dto.files.map((item) => {
            return { ...item };
          }),
          applicants: {
            upsert: dto?.applicants?.map((item) => {
              return {
                where: { id: item.id },
                create: {
                  lastname: item.lastname,
                  name: item.name,
                  passportNumber: Number(item.passportNumber),
                  passportSeriya: item.passportSeriya,
                  deleted: null,
                  createdBy: dto.createdBy,
                },
                update: {
                  lastname: item.lastname,
                  name: item.name,
                  passportNumber: Number(item.passportNumber),
                  passportSeriya: item.passportSeriya,
                  deleted: null,
                },
              };
            }),
          },
        },
        include: {
          applicants: true,
          resolution: true,
          work: true,
          workSets: true,
        },
      });
      return plainToInstance(arzaResponse, arza);
    } catch (err) {
      console.log(err);
      throw new RpcException({ statusCode: 101, message: 'some text data' });
    }
  }

  async findAllArza(dto: FindAllDto): Promise<Arzalar> {
    // TODO observeable etmeli
    let pageSize: number = dto.pageSize || 10;
    let page: number = dto.page || 1;
    const skip: number = page * pageSize - pageSize;
    let whereInput: Prisma.umumyArzalarWhereInput = {
      deleted: null,
      registredNumber: dto?.registredNumber ? dto?.registredNumber : { gte: 0 },
      descrtiption: { contains: dto?.search, mode: 'insensitive' },
      applicants: dto?.name
        ? {
            some: {
              OR: [
                { lastname: { contains: dto?.name, mode: 'insensitive' } },
                { name: { contains: dto?.name, mode: 'insensitive' } },
              ],
            },
          }
        : {},
    };
    if (dto?.created) {
      whereInput = { ...whereInput, created: new Date(dto?.created) };
    }
    const count = await this.prismaClient.umumyArzalar.count({
      where: whereInput,
    });
    const rows = await this.prismaClient.umumyArzalar.findMany({
      where: whereInput,
      include: {
        applicants: true,
        resolution: true,
        work: true,
        workSets: true,
      },
      orderBy: { created: 'desc' },
      take: pageSize,
      skip: skip,
    });
    const newlyCount = await this.prismaClient.umumyArzalar.count({
      where: { ...whereInput, status: 'newly' },
    });
    const delayCount = await this.prismaClient.umumyArzalar.count({
      where: { ...whereInput, status: 'delay' },
    });
    return {
      count,
      newlyCount,
      delayCount,
      rows: plainToInstance(arzaResponse, rows),
    };
  }

  async findOneArza({ id }: FindOneArzaDto): Promise<Arza> {
    console.log(">>>>>>>>>>>>>> findOneArza looking for ", id)
    const arza = await this.prismaClient.umumyArzalar.findFirst({
      where: { id: id, deleted: null },
      include: {
        applicants: true,
        resolution: true,
        workSets: true,
        work: true,
      },
    });
    if (!arza?.id) {
      throw new RpcException({ code: 404, message: 'arza not found' });
    }
    console.log('>>>>>>>>>>>>>>> found arza...')
    console.log(arza.id, '\n\n')
    return plainToInstance(arzaResponse, arza);
  }

  async removeArza({ id }: FindOneArzaDto): Promise<Arza> {
    const arza = await this.prismaClient.umumyArzalar.update({
      where: { id: id },
      data: { deleted: new Date() },
      include: { applicants: true },
    });
    return plainToInstance(arzaResponse, arza);
  }

  async createDismantle(dto: CreateDismantleDto): Promise<Arza> {
    try {
      await this.prismaClient.dismantle.upsert({
        where: { statementId: dto.statementId },
        create: {
          statementId: dto.statementId,
          prosecutorResult: dto.prosecutorResult,
          deleted: null,
        },
        update: {
          statementId: dto.statementId,
          prosecutorResult: dto.prosecutorResult,
          deleted: null,
        },
      });
      return this.findOneArza({ id: dto.statementId });
    } catch (err) {
      throw new RpcException({ statusCode: 101, message: 'some text data' });
    }
  }

  /* YOLBASHCHY UCHIN */
  async createResolution(dto: Resolution) {
    try {
      let arza = await this.findOneArza({ id: dto.arzaId });
      await this.prismaClient.arzaResolution.upsert({
        where: { arzaId: dto.arzaId },
        create: {
          executorId: dto.executorId,
          note: dto?.note || '',
          type: 'arza',
          arzaId: dto.arzaId,
          createdBy: dto.createdBy,
          deleted: null,
        },
        update: {
          executorId: dto.executorId,
          note: dto?.note || '',
          type: 'arza',
          arzaId: dto.arzaId,
          createdBy: dto.createdBy,
          deleted: null,
        },
      });
      await this.prismaClient.workSets.create({
        data: {
          createdBy: dto.createdBy,
          type: arza.status.toString(),
          arzaId: dto.arzaId,
          author: arza.applicants[0].name + arza.applicants[0].lastname,
          company: 'creator_company',
          files: arza.files.map((item) => {
            return { ...item };
          }),
        },
      });
      return this.findOneArza({ id: dto.arzaId });
    } catch (err) {
      throw new RpcException({ statusCode: 101, message: 'some text data' });
    }
  }

  async archiveAza({ id }: FindOneArzaDto) {
    await this.prismaClient.umumyArzalar.update({
      where: { id: id },
      data: { status: arzaStatusEnum.archive },
    });
    return this.findOneArza({ id: id });
  }

  async addWorkSets(dto: WorkSetDto) {
    const workSet = await this.prismaClient.workSets.upsert({
      where: { id: dto?.id ? dto?.id : '' },
      create: {
        files: dto.files.map((item) => {
          return { ...item };
        }),
        createdBy: dto.createdBy,
        author: dto.author,
        company: dto.company,
        type: dto.type,
        arzaId: dto.arzaId,
        deleted: null,
      },
      update: {
        files: dto.files.map((item) => {
          return { ...item };
        }),
        createdBy: dto.createdBy,
        author: dto.author,
        company: dto.company,
        type: dto.type,
        arzaId: dto.arzaId,
        deleted: null,
      },
    });
    return workSet;
  }
}
