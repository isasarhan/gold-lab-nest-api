import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Currency } from 'src/common/types/enums';
import { Karat } from 'src/modules/order/schema/order.schema';


@Schema({ timestamps: true })
export class SupplyPayment {
    @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
    supplier: Types.ObjectId;

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

    @Prop({ type: String, enum: Currency, default: Currency.Usd })
    currency: Currency;

    @Prop()
    description: string;
}

export const SupplyPaymentSchema = SchemaFactory.createForClass(SupplyPayment);
