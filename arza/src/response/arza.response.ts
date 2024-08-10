import { Arza } from "@/arza/arza";
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class arzaResponse implements Arza{
  applicant: string;
  description: string;
  id: string;
  prosecutorResult: string;
  recivedNumber: string;
  result: string;
  userId: string;
  @Transform(({ value }) => { return `${new Date(value).toISOString()}` }, { toClassOnly: true }, )
  recivedDate: string;
  @Transform(({ value }) => { return `${new Date(value).toISOString()}` }, { toClassOnly: true }, )
  workedDate: string;
  @Transform(({ value }) => { return `${new Date(value).toISOString()}` }, { toClassOnly: true }, )
  executedDate: string;
  @Transform(({ value/*, key, obj, type*/ }) => { return `${new Date(value).toISOString()}` }, { toClassOnly: true }, )
  executorRecivedDate: string;
}