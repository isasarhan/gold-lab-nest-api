import { IsOptional } from 'class-validator';

export class Pagination {
  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;

  @IsOptional()
  searchTerm?: string
}

export type IFilter = Record<string, any>;
