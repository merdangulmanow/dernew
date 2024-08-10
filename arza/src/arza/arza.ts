// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.1
//   protoc               v5.27.2
// source: arza.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "arza";

export enum arzaStatus {
  newly = 0,
  working = 1,
  delay = 3,
  UNRECOGNIZED = -1,
}

export interface Empty {
}

export interface FindAllDto {
  recivedNumber?: string | undefined;
  recivedDate?: string | undefined;
  applicant?: string | undefined;
  status?: arzaStatus | undefined;
  page: number;
  pageSize: number;
}

export interface CreateArzaDto {
  recivedNumber: string;
  recivedDate: string;
  executorRecivedDate: string;
  executedDate: string;
  workedDate: string;
  applicant: string;
  description: string;
  result: string;
  prosecutorResult: string;
  userId: string;
}

export interface Arza {
  id: string;
  recivedNumber: string;
  recivedDate: string;
  executorRecivedDate: string;
  executedDate: string;
  workedDate: string;
  applicant: string;
  description: string;
  result: string;
  prosecutorResult: string;
  userId: string;
}

export interface Arzalar {
  count: number;
  rows: Arza[];
}

export interface FindOneArzaDto {
  id: string;
}

export const ARZA_PACKAGE_NAME = "arza";

export interface ArzaServiceClient {
  createArza(request: CreateArzaDto): Observable<Arza>;

  findAllArza(request: FindAllDto): Observable<Arzalar>;

  findOneArza(request: FindOneArzaDto): Observable<Arza>;

  removeArza(request: FindOneArzaDto): Observable<Arza>;
}

export interface ArzaServiceController {
  createArza(request: CreateArzaDto): Promise<Arza> | Observable<Arza> | Arza;

  findAllArza(request: FindAllDto): Promise<Arzalar> | Observable<Arzalar> | Arzalar;

  findOneArza(request: FindOneArzaDto): Promise<Arza> | Observable<Arza> | Arza;

  removeArza(request: FindOneArzaDto): Promise<Arza> | Observable<Arza> | Arza;
}

export function ArzaServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createArza", "findAllArza", "findOneArza", "removeArza"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ArzaService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ArzaService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ARZA_SERVICE_NAME = "ArzaService";
