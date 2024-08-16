import {
  Applicant,
  Arza,
  arzaStatusEnum,
  Files,
  Works,
  Resolution,
  workTypeEnum,
  WorkSetItems,
  WorkSet,
} from '@/arza/arza';
import { Expose, Transform, Type } from 'class-transformer';
import { Prisma } from 'generated/client';

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

export class workSetResponse implements WorkSet {
  id: string;
  arzaId: string;
  companyId: string;
  executorId: string;
  registredNumber: string;
  type: string;

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
  @Expose({ name: 'workSets' })
  @Type(() => workSetResponse)
  workSets: workSetResponse;
}

export class workSetItemResponse implements WorkSetItems {
  id?: string;
  company: string;
  createdBy: string;
  files: Files[];
  type: string;
  companyId: string;
  status: string;
  author: string;
  created?: string;
  workSetId: string;
}
