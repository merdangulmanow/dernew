import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ArzaServiceController, ArzaServiceControllerMethods, CreateArzaDto, FindAllDto, FindOneArzaDto } from './arza/arza';

@Controller()
// @ArzaServiceControllerMethods()
export class AppController  {
  constructor(private readonly appService: AppService) {}

  // createArza(request: CreateArzaDto) {
  //   return this.appService.createArza(request);
  // }

  // findAllArza(request: FindAllDto) {
  //   return this.appService.findAllArza(request);
  // }

  // findOneArza(request: FindOneArzaDto) {
  //   return this.appService.findOneArza(request);
  // }

  // removeArza(request: FindOneArzaDto) {
  //   return this.appService.removeArza(request);
  // }
}
