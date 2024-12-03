import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../../roles/schemas/role.schemas';

export type UserDocument = HydratedDocument<User>
export class IUserSchema {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId,
    name: string
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken: string;

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  }

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  }

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  }
  
  @Prop()
  isDeleted: boolean
 
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;


  @Prop()
  deletedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User);