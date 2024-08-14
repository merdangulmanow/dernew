import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ArzaService } from './arza.service';
import {
  ArzaServiceControllerMethods,
  CreateArzaDto,
  CreateDismantleDto,
  FindAllDto,
  FindOneArzaDto,
  Resolution,
  WorkSetDto,
} from './arza';
import { GrpcMethod } from '@nestjs/microservices';
import { Http2gRPCExceptionFilter } from '@/http2gRPCException.filter';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
@ArzaServiceControllerMethods()
export class ArzaController {
  constructor(private readonly arzaService: ArzaService) {}

  // @GrpcMethod('ArzaService', 'createArza')
  createArza(request: CreateArzaDto /* metadata: grpc.Metadata */) {
    return this.arzaService.createArza(request);
  }

  findAllArza(request: FindAllDto) {
    return this.arzaService.findAllArza(request);
  }

  // @UseFilters(new Http2gRPCExceptionFilter())
  findOneArza(request: FindOneArzaDto) {
    console.log(">>>>>>>>>>>> arzaController findOneArza\n")
    return this.arzaService.findOneArza(request);
  }

  removeArza(request: FindOneArzaDto) {
    return this.arzaService.removeArza(request);
  }

  createDismantle(request: CreateDismantleDto) {
    return this.arzaService.createDismantle(request);
  }

  createResolution(request: Resolution) {
    return this.arzaService.createResolution(request);
  }

  archiveAza(request: FindOneArzaDto) {
    return this.arzaService.archiveAza(request);
  }

  addWorkSets(request: WorkSetDto) {
    return this.arzaService.addWorkSets(request);
  }
}
