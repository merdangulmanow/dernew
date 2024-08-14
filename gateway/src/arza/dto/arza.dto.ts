import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateApplicantDto,
  CreateArzaDto,
  Files,
  Resolution,
  WorkSetDto,
  workTypeEnum,
} from '../arza';
import { Expose, Transform, Type } from 'class-transformer';

export class filesDto implements Files {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
  @IsNotEmpty()
  @IsString()
  readonly url: string;
}

export class applicantDto implements CreateApplicantDto {
  @IsOptional()
  @IsString()
  @Expose()
  @Transform(({ value }) => {
    return value ? value : '';
  })
  readonly id: string;
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly lastname: string;
  @IsNotEmpty()
  @IsNumber()
  readonly passportNumber: number;
  @IsNotEmpty()
  @IsString()
  readonly passportSeriya: string;
}

export class createArzaDto implements CreateArzaDto {
  @IsOptional()
  @IsString()
  @Expose()
  @Transform(({ value }) => {
    return value ? value : '';
  })
  readonly id: string;
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => filesDto)
  readonly files: filesDto[];
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => applicantDto)
  readonly applicants: applicantDto[];
  @IsOptional()
  @IsDateString()
  readonly created?: string;
  @IsNotEmpty()
  @IsString()
  readonly descrtiption: string;
  @IsOptional()
  @IsString()
  createdBy: string;
}

export class resolutionDto implements Resolution {
  @IsNotEmpty()
  @IsString()
  readonly arzaId: string;
  @IsNotEmpty()
  @IsEnum(workTypeEnum)
  readonly type: workTypeEnum;
  @IsNotEmpty()
  @IsString()
  readonly executorId: string;
  @IsOptional()
  @IsString()
  readonly note?: string;
  @IsOptional()
  @IsString()
  readonly createdBy?: string;
}

export class workSetDto implements WorkSetDto {
  @IsOptional()
  @IsString()
  @Expose()
  @Transform(({ value }) => {
    return value ? value : '';
  })
  readonly id?: string;
  @IsNotEmpty()
  @IsString()
  readonly arzaId: string;
  @IsNotEmpty()
  @IsString()
  readonly author: string;
  @IsNotEmpty()
  @IsString()
  readonly company: string;
  @IsOptional()
  @IsString()
  readonly createdBy?: string;
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => filesDto)
  readonly files: filesDto[];
  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
