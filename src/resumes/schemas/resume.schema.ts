import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUserSchema } from '../../users/schemas/users.schema';
import { Company } from '../../companies/schemas/company.schema';
import { Job } from '../../jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>;

class IHistorySchema {
  status: string;
  updatedAt: Date;
  UpdatedBy:IUserSchema;
  
}
@Schema({ timestamps: true })
export class Resume {
  @Prop()
  email: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId

  @Prop()
  url: string
  
  @Prop()
  status: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
  jobId: mongoose.Schema.Types.ObjectId;
  
  @Prop()
  history: IHistorySchema[]

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);