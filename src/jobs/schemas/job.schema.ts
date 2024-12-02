import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUserSchema } from '../../users/schemas/users.schema';
import { ICompanySchema } from '../../companies/schemas/company.schema';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
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

  @Prop({ type: Object })
  createdBy: IUserSchema;

  @Prop({ type: Object })
  updatedBy: IUserSchema;

  @Prop({ type: Object })
  deletedBy: IUserSchema;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);