import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUserSchema } from '../../users/schemas/users.schema';
import { ICompanySchema } from '../../companies/schemas/company.schema';
import { BaseSchema } from '../../common/base.schema';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job extends BaseSchema{
  @Prop()
  name: string;

  @Prop()
  logo: string;

  @Prop({ type: [String] })
  skills: string[];

  @Prop({ type: Object })
  company: ICompanySchema;

  @Prop()
  location: string;

  @Prop()
  salary: number;

  @Prop()
  quantity: number;

  @Prop()
  level: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  isActive: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);