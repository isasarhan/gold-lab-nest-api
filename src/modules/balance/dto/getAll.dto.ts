import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsMongoId, IsOptional } from "class-validator";
import { Pagination } from "src/common/types/filter";

export class GetBalanceFilterDto extends Pagination {

}