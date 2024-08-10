import { Injectable, OnModuleInit } from '@nestjs/common';
import { Arza, Arzalar, CreateArzaDto, FindAllDto, FindOneArzaDto } from './arza/arza';

@Injectable()
export class AppService implements OnModuleInit{
  private readonly arzalar: Arza[] = [];
  onModuleInit() {
    console.log("AppService ==> ArzaService module inited.....")
  }
  
  // createArza(request: CreateArzaDto): Arza | Promise<Arza> {
  //   return {...request, id : '1111111111111111'}
  // }

  // findAllArza(request: FindAllDto): Arzalar | Promise<Arzalar> {
  //   return { count: 0, rows: this.arzalar };
  // }

  // findOneArza(request: FindOneArzaDto): Arza | Promise<Arza> {
  //   return this.arzalar[0];
  // }

  // removeArza(request: FindOneArzaDto): Arza | Promise<Arza> {
  //   return this.arzalar[0];
  // }
}
