import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from 'generated/client';

@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      errorFormat: 'minimal',
      // log: [
      //   { emit: 'stdout', level: 'query' },
      //   { emit: 'stdout', level: 'info' },
      //   { emit: 'stdout', level: 'error' },
      // ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.$use(async (params, next) => {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date() };
      }
      if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args['data'] = { deletedAt: new Date() };
        } else {
          params.args['data'] = { deletedAt: new Date() };
        }
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
