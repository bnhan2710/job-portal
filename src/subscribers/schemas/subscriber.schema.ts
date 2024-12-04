import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../common/base.schema';

export type SubscriberDocument = HydratedDocument<Subscriber>

@Schema({ timestamps: true })
export class Subscriber extends BaseSchema{
    @Prop()
    email: string

    @Prop()
    name: string

    @Prop({ type: [String] })
    skills:string[]
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);