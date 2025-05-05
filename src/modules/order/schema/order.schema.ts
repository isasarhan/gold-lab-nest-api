import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export enum ItemType {
  Gormet = 'gormet',
  Boul = 'boul',
  Lock = 'lock',
  Stamp = 'stamp',
  Ramle = 'ramle',
  Forza = 'forza',
  Other = 'other',
}

export enum Karat {
  K18 = '18K',
  K21 = '21K',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: ObjectId;

  @Prop({ type: Number, default: 0 })
  weight: number;

  @Prop({ type: String, enum: Karat, default: Karat.K18 })
  karat: Karat;

  @Prop({ type: Number, default: 0 })
  perGram: number;

  @Prop({ type: Number, default: 0 })
  perItem: number;

  @Prop()
  invoiceNb: string;

  @Prop({ type: String, enum: ItemType, default: ItemType.Other })
  type: ItemType;

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop()
  description: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
