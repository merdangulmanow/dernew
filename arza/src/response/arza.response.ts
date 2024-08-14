import {
  Applicant,
  Arza,
  arzaStatusEnum,
  Files,
  Works,
  Resolution,
  workTypeEnum,
} from '@/arza/arza';
import { Expose, Transform, Type } from 'class-transformer';

/* 
import { dismantle } from 'generated/client';
export class dismantleResponse implements dismantle {
  @Transform( ({ value }) => { return `${new Date(value).toISOString()}`; }, { toClassOnly: true }, )
  created: Date;
  id: string;
  prosecutorResult: string;
  @Expose()
  statementId: string;
  @Expose()
  deletedAt: Date;
  @Expose()
  updatedAt: Date;
}
*/

export class applicantsResponse implements Applicant {
  id: string;
  arzaId: string;
  lastname: string;
  name: string;
  passportNumber: number;
  passportSeriya: string;
}

export class resolutionResponse implements Resolution {
  arzaId: string;
  executorId: string;
  note?: string;
  type: workTypeEnum;
}

export class arzaResponse implements Arza {
  id: string;
  descrtiption: string;
  registredNumber: number;
  status: arzaStatusEnum;
  files: Files[];
  createdBy: string;
  work?: Works;
  @Type(() => applicantsResponse)
  applicants: applicantsResponse[];
  @Transform(
    ({ value }) => {
      return `${new Date(value).toISOString()}`;
    },
    { toClassOnly: true },
  )
  created: string;
  @Transform(
    ({ value }) => {
      return `${new Date(value).toISOString()}`;
    },
    { toClassOnly: true },
  )
  deadline: string;
  @Expose({ name: 'resolution' })
  @Type(() => resolutionResponse)
  resolution: resolutionResponse;
}
