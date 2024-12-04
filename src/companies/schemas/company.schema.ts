import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../common/base.schema';
export type CompanyDocument = HydratedDocument<Company>;
export class ICompanySchema {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    logo: string
  }
@Schema({ timestamps: true })
export class Company extends BaseSchema {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    description: string;

    @Prop()
    logo: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);