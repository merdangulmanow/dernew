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
import {
  ArzaServiceClient,
  FindAllDto,
} from './arza';
import { ClientGrpc } from '@nestjs/microservices';
import { baseResponseInterceptor } from '@/filters/base-response-filter';
import { createArzaDto, resolutionDto, workSetDto } from './dto/arza.dto';
import { RequestWithUser } from '@/utils/request-with-user';

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
    return this.arzaService.findOneArza({ id });
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
  addWorkSets(@Body() dto: workSetDto, @Req() req: RequestWithUser) {
    return this.arzaService.addWorkSets({
      ...dto,
      createdBy: req.id || 'user-id',
    });
  }
}
