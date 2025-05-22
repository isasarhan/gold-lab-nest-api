import { PartialType } from "@nestjs/mapped-types";
import { CreateDailyWorkflowDto } from "./create.dto";

export class UpdateDailyWorkflowDto extends PartialType(CreateDailyWorkflowDto) {}
