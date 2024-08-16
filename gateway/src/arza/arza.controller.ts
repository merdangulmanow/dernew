import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  OnModuleInit,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { ArzaServiceClient, FindAllDto, FindAllWorkSetsDto } from './arza';
import { ClientGrpc } from '@nestjs/microservices';
import { baseResponseInterceptor } from '@/filters/base-response-filter';
import { createArzaDto, resolutionDto, workSetItemDto } from './dto/arza.dto';
import { RequestWithUser } from '@/utils/request-with-user';

@UseInterceptors(baseResponseInterceptor)
@Controller('arza')
export class ArzaController implements OnModuleInit {
  private arzaService: ArzaServiceClient;
  constructor(@Inject('arza') private client: ClientGrpc) {}
  onModuleInit() {
    this.arzaService = this.client.getService<ArzaServiceClient>('ArzaService');
  }
  @Post('/')
  create(@Body() createArzaDto: createArzaDto) {
    return this.arzaService.createArza(createArzaDto);
  }

  @Get('/')
  findAll(@Query() dto: FindAllDto) {
    return this.arzaService.findAllArza(dto);
  }

  @Post('/remove/:id')
  remove(@Param('id') id: string) {
    return this.arzaService.removeArza({ id });
  }

  @Post('/archive/:arzaId')
  archiveAza(@Param('arzaId') arzaId: string, @Req() req: RequestWithUser) {
    return this.arzaService.archiveAza({ id: arzaId });
  }

  @Post('/resolution')
  createOrder(@Body() dto: resolutionDto, @Req() req: RequestWithUser) {
    return this.arzaService.createResolution({
      ...dto,
      createdBy: req.id || 'user-id',
    });
  }

  @Post('/workset')
  addWorkSets(@Body() dto: workSetItemDto, @Req() req: RequestWithUser) {
    return this.arzaService.addWorkSetItem({
      ...dto,
      createdBy: req.id || 'user-id',
    });
  }

  @Get('/worksets')
  getWorkSets(@Query() dto: FindAllWorkSetsDto) {
    return this.arzaService.getWorkSets(dto);
  }

  @Get('/worksets/:id')
  getWorkSetItems(@Param('id') id: string) {
    return this.arzaService.getWorkSetsItems({ id: id });
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.arzaService.findOneArza({ id });
  }
}
