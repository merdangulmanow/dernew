import {
  Inject,
  Injectable,
  OnModuleInit,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  Arza,
  ArzaServiceClient,
  arzaStatusEnum,
  CreateArzaDto,
  FindAllDto,
  FindOneArzaDto,
} from './arza';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class ArzaService implements OnModuleInit {
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

  async findOneArza(dto: FindOneArzaDto) {
    
    return this.arzaService
      .findOneArza(dto)
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        }),
      )
      .toPromise();
  }
}
