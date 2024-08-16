import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { ArzaService } from './arza.service';
import {
  ApproveDocDto,
  ArzaServiceControllerMethods,
  CreateArzaDto,
  CreateDismantleDto,
  FindAllDto,
  FindAllWorkSetsDto,
  FindOneArzaDto,
  Resolution,
  WorkSetItems,
} from './arza';

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
    console.log('>>>>>>>>>>>> arzaController findOneArza\n');
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

  addWorkSetItem(request: WorkSetItems) {
    return this.arzaService.addWorkSetItem(request);
  }

  // getWorkSets(request: Observable<FindAllWorkSetsDto>) {
  getWorkSets(request: FindAllWorkSetsDto) {
    return this.arzaService.getWorkSets(request);
  }

  getWorkSetsItems(request: FindOneArzaDto) {
    return this.arzaService.getWorkSetsItems(request);
  }

  approveDoc(request: ApproveDocDto){
    return this.arzaService.approveDoc(request)
  }
}
