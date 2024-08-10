import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Inject,
  OnModuleInit,
  UseInterceptors,
} from '@nestjs/common';
import { ArzaServiceClient, CreateArzaDto, FindAllDto } from './arza';
import { ClientGrpc } from '@nestjs/microservices';
import { baseResponseInterceptor } from '@/filters/base-response-filter';
import { createArzaDto } from './dto/arza.dto'

@UseInterceptors(baseResponseInterceptor)
@Controller('arza')
export class ArzaController implements OnModuleInit {
  private arzaService: ArzaServiceClient;
  constructor(@Inject('arza') private client: ClientGrpc) {}
  onModuleInit() {
    this.arzaService = this.client.getService<ArzaServiceClient>('ArzaService');
  }
  @Post()
  create(@Body() createArzaDto: createArzaDto) {
    return this.arzaService.createArza(createArzaDto);
  }

  @Get()
  findAll(@Query() dto: FindAllDto) {
    return this.arzaService.findAllArza(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.arzaService.findOneArza({id});
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arzaService.removeArza({id});
  }
}
