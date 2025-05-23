import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { MonthEnum } from "src/utils/date-utilities";


@Schema({ _id: false })
export class YearMonthDate {
    @Prop({ type: String, enum: MonthEnum })
    month: MonthEnum;

    @Prop()
    year: string;
}
export const YearMonthDateSchema = SchemaFactory.createForClass(YearMonthDate);

@Schema({ _id: false })
class Employee {
    @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
    _id: ObjectId;

    @Prop()
    name: string;

    @Prop()
    salary: number;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

export enum PaymentTypeEnum {
    Bonus = 'bonus',
    Advance = 'advance',
    Overtime = 'overtime',
    Commission = 'commission',
    Monthly = 'monthly'
}

@Schema({ _id: false })
class SalaryPayment {
    @Prop({ type: Date })
    date: Date;

    @Prop()
    amount: number;

    @Prop({ type: String, enum: PaymentTypeEnum, default: PaymentTypeEnum.Monthly })
    type: PaymentTypeEnum;

    @Prop()
    description: string
}

export const SalaryPaymentSchema = SchemaFactory.createForClass(SalaryPayment);

@Schema()
export class SalaryReport {
    @Prop({ type: YearMonthDateSchema, unique: true })
    @Type(() => YearMonthDate)
    date: YearMonthDate

    @Prop({ type: EmployeeSchema })
    @Type(() => Employee)
    employee: Employee

    @Prop({ type: [SalaryPaymentSchema] })
    @Type(() => SalaryPayment)
    payments: SalaryPayment[];
}

export type SalaryReportDocument = HydratedDocument<SalaryReport>;
export const SalaryReportSchema = SchemaFactory.createForClass(SalaryReport);