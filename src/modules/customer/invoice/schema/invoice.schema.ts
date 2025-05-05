import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Invoice {
  @Prop()
  invoiceNb: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Order', required: true })
  orders: Types.ObjectId[];

  @Prop({ default: 0 })
  totalWeight: number;

  @Prop({ default: 0 })
  totalCash: number;

  @Prop({ default: Date.now })
  date: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
