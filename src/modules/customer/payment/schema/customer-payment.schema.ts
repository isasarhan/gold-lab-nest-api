import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop()
  invoiceNb: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  weight: number;

  @Prop()
  karat: number;

  @Prop()
  cash: number;

  @Prop()
  currency: string;

  @Prop()
  description: string;
}

export const PaymentSchema =
  SchemaFactory.createForClass(Payment);
