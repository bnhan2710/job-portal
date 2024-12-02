import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUserSchema } from '../../users/schemas/users.schema';

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

  @Prop()
  companyId: mongoose.Schema.Types.ObjectId
  
  @Prop()
  jobId: mongoose.Schema.Types.ObjectId
  
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