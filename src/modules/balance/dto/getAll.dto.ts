import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsMongoId, IsOptional } from "class-validator";
import { Pagination } from "src/common/types/filter";

export enum BalancessSort {
    HighestGold = "HighestGold",
    HighestCash = "HighestCash",
    LowestGold = "LowestGold",
    LowestCash = "LowestCash",
}

export class GetBalanceFilterDto extends Pagination {
    @IsOptional()
    @IsEnum(BalancessSort)
    sort?: BalancessSort;
}