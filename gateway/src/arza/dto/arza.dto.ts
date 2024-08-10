import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import { CreateArzaDto } from "../arza";

export class createArzaDto implements CreateArzaDto {
  @IsNotEmpty()
  @IsString()
  readonly applicant: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsDateString()
  readonly executedDate: string;
  @IsNotEmpty()
  @IsDateString()
  readonly executorRecivedDate: string;
  @IsNotEmpty()
  @IsString()
  readonly prosecutorResult: string;
  @IsNotEmpty()
  @IsDateString()
  readonly recivedDate: string;
  @IsNotEmpty()
  @IsString()
  readonly recivedNumber: string;
  @IsNotEmpty()
  @IsString()
  readonly result: string;
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
  @IsNotEmpty()
  @IsDateString()
  readonly workedDate: string;
}