import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Balance {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: ObjectId;

  @Prop({ type: Number, default: 0 })
  gold: number;

  @Prop({ type: Number, default: 0 })
  cash: number;
}
export type BalanceDocument = HydratedDocument<Balance>;

export const BalanceSchema = SchemaFactory.createForClass(Balance);
