import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUserSchema } from '../../users/schemas/users.schema';
import { Company } from '../../companies/schemas/company.schema';
import { Job } from '../../jobs/schemas/job.schema';
import { BaseSchema } from '../../common/base.schema';

export type ResumeDocument = HydratedDocument<Resume>;

class IHistorySchema {
  status: string;
  updatedAt: Date;
  UpdatedBy:IUserSchema;
  
}
@Schema({ timestamps: true })
export class Resume extends BaseSchema{
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

}

export const ResumeSchema = SchemaFactory.createForClass(Resume);