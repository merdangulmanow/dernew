import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Arza, ArzaServiceClient, arzaStatusEnum, CreateArzaDto, FindAllDto, FindOneArzaDto } from './arza';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable()
export class ArzaService implements OnModuleInit {
  // constructor(private readonly arzaService: ArzaService) {}
  constructor(@Inject('arza') private client: ClientGrpc) {}
  private arzaService: ArzaServiceClient;  
  onModuleInit() {
    this.arzaService = this.client.getService<ArzaServiceClient>('ArzaService');
  }


  create(createArzaDto: CreateArzaDto) {
    return this.arzaService.createArza(createArzaDto);
  }

  findAll(dto: FindAllDto) {
    return this.arzaService.findAllArza(dto);
  }

  findOneArza(dto: FindOneArzaDto) {
    console.log(">>>>>>>>>> findOneArza ", dto)
    return this.arzaService.findOneArza(dto)
  }  
}
