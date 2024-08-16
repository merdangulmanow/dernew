import {
  ApproveDocDto,
  Arza,
  Arzalar,
  CreateArzaDto,
  CreateDismantleDto,
  FindAllDto,
  FindAllWorkSetsDto,
  FindOneArzaDto,
  Resolution,
  WorkSetItems,
  WorkSets,
} from './arza';
import { PrismaClientService } from '@/prisma-client/prisma-client.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { arzaResponse,  } from '@/response/arza.response';
import { RpcException } from '@nestjs/microservices';
import {
  arzaStatusEnum,
  Prisma,
} from 'generated/client';
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
          type: 'jenayat_hadysa', // mock
          arzaId: dto.arzaId,
          executorId: dto.executorId,
          registredNumber: `${randomInt(2, 100)}`,
          // author: arza.applicants[0].name + arza.applicants[0].lastname,
          companyId: 'creator_company',
          // files: arza.files.map((item) => {
          //   return { ...item };
          // }),
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

  async addWorkSetItem(dto: WorkSetItems) {
    console.log(dto)
    const workSet = await this.prismaClient.workSetItems.upsert({
      where: { id: dto?.id ? dto?.id : '' },
      create: {
        files: dto.files.map((item) => {
          return { ...item };
        }),
        createdBy: dto.createdBy,
        author: dto.author,
        type: dto.type,
        deleted: null,
        company: dto.company,
        workSetId: dto.workSetId,
      },
      update: {
        files: dto.files.map((item) => {
          return { ...item };
        }),
        createdBy: dto.createdBy,
        author: dto.author,
        type: dto.type,
        deleted: null,
        company: dto.company,
        workSetId: dto.workSetId,
      },
    });
    return workSet;
  }

  async getWorkSets(dto: FindAllWorkSetsDto): Promise<WorkSets> {
    try {
      let pageSize: number = dto.pageSize || 10;
      let page: number = dto.page || 1;
      const skip: number = page * pageSize - pageSize;
      const count = await this.prismaClient.workSets.count({
        where: { deleted: null },
      });
      const rows = await this.prismaClient.workSets.findMany({
        where: { deleted: null },
        take: pageSize,
        skip: skip,
      });
      return { count, rows };
    } catch (err) {}
  }

  async getWorkSetsItems(dto: FindOneArzaDto) {
    const workSet = await this.prismaClient.workSets.findFirst({
      where: { id: dto.id, deleted: null },
      include: {
        items: {
          orderBy: { created: 'desc' },
        },
      },
    });
    if (!workSet?.id) {
      throw new RpcException({ code: 404, message: 'workset not found' });
    }
    return workSet;
  }

  async getOneWorkSetItem({id}: FindOneArzaDto){
    try {
      const item= await this.prismaClient.workSetItems.findFirst({where: {id: id, deleted: null}})
      if(!item?.id){
        throw new RpcException({ code: 404, message: 'workset not found' });
      }
      return item
    } catch (err) {
      throw new RpcException({ code: 404, message: 'workset not found' });
    }
  }

  async approveDoc(dto: ApproveDocDto){
    try {
      await this.getOneWorkSetItem({id:dto.id})
      await this.prismaClient.workSetItems.update({
        where: {id: dto.id},
        data: {status: dto?.approve == true ? 'approved': 'rejected', reason: dto?.reason || ""}
      })
      return this.getOneWorkSetItem({id: dto.id})
    } catch (err) {
      throw new RpcException({ code: 404, message: 'workset not found' });
    }
  }
}
