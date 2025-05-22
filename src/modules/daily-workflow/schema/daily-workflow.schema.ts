import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { HydratedDocument } from "mongoose";
import { Karat } from "src/modules/order/schema/order.schema";

export enum Sector {
    Inventory = "inventory",
    Melting = "melting",
    Table = "table",
    Pull = "pull",
    Saw = "saw",
    Delivery = "delivery",
    Setting = "setting",
}

@Schema({ _id: false })
export class Report {
    @Prop({ type: String, enum: Sector })
    from: Sector;

    @Prop({ type: String, enum: Sector })
    to: Sector;

    @Prop({ type: String, enum: Karat })
    karat: Karat;

    @Prop()
    weight: number

    @Prop()
    quantity: number

    @Prop()
    description: string;
}
export const ReportSchema = SchemaFactory.createForClass(Report);


@Schema({ _id: false })
export class ReportBalance {
    @Prop({ type: String, enum: Sector })
    sector: Sector;

    @Prop({ default: 0 })
    weight: number;

    @Prop({ default: 0 })
    quantity: number;

    @Prop({ type: String, enum: Karat })
    karat: Karat;
}
export const ReportBalanceSchema = SchemaFactory.createForClass(ReportBalance);

@Schema()
export class DailyWorkflow {
    @Prop({ type: Date, required: true, default: Date.now })
    date: Date;

    @Prop({ type: [ReportSchema], default: [] })
    @Type(() => Report)
    reports: Report[];

    @Prop({ type: [ReportBalanceSchema] })
    @Type(() => ReportBalance)
    balances: ReportBalance[];
}
export type DailyWorkflowDocument = HydratedDocument<DailyWorkflow>;
export const DailyWorkflowSchema = SchemaFactory.createForClass(DailyWorkflow);
