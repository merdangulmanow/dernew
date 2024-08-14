import { PartialType } from '@nestjs/mapped-types';
import { CreateArzaDto } from './create-arza.dto';

export class UpdateArzaDto extends PartialType(CreateArzaDto) {}
