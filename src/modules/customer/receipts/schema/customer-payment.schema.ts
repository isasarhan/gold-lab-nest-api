import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Currency } from 'src/common/types/enums';


@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop()
  invoiceNb: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ default: 0 })
  weight: number;

  @Prop({ default: 995 })
  karat: number;

  @Prop({ default: 0 })
  cash: number;

    @Prop({ type: String, enum: Currency, default: Currency.Usd })
  currency: Currency;
  

  @Prop()
  description: string;
}

export const PaymentSchema =
  SchemaFactory.createForClass(Payment);
