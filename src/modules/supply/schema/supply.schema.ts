import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ItemType, Karat } from 'src/modules/order/schema/order.schema';

@Schema({ timestamps: true })
export class Supply {
    @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
    supplier: Types.ObjectId;

    @Prop({ default: 0 })
    weight: number;

    @Prop({ type: String, enum: Karat, default: Karat.K18 })
    karat: Karat;

    @Prop({ default: 0 })
    perGram: number;

    @Prop({ default: Date.now })
    date: Date;

    @Prop()
    description: string;

    @Prop()
    invoiceNb: string;

    @Prop({ type: String, enum: ItemType, default: ItemType.Other })
    type: ItemType;
}

export const SupplySchema = SchemaFactory.createForClass(Supply);
