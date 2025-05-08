import { IsOptional } from 'class-validator';

export class Pagination {
  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;
}

export type IFilter = Record<string, any>;
