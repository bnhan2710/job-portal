import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUserSchema } from '../../users/schemas/users.schema';
import { Permission } from '../../permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {

  @Prop()
  name: string

  @Prop()
  description: string

  @Prop()
  isActive: boolean

  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Permission.name})
  permissions: Permission[]

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

export const RoleSchema = SchemaFactory.createForClass(Role);