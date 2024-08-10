import { ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { ArzaService } from './arza.service';
import { ArzaServiceControllerMethods, CreateArzaDto, FindAllDto, FindOneArzaDto } from './arza';import { HttpToGrpcInterceptor } from 'nestjs-grpc-exceptions';
;

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
@ArzaServiceControllerMethods()
export class ArzaController {
  constructor(private readonly arzaService: ArzaService) {}

  // @UseInterceptors(HttpToGrpcInterceptor)
  createArza(request: CreateArzaDto) {
    return this.arzaService.createArza(request);
  }

  findAllArza(request: FindAllDto) {
    return this.arzaService.findAllArza(request);
  }

  findOneArza(request: FindOneArzaDto) {
    return this.arzaService.findOneArza(request);
  }

  removeArza(request: FindOneArzaDto) {
    return this.arzaService.removeArza(request);
  }
}
