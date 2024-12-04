import { Prop, Schema } from '@nestjs/mongoose';
import { IUserSchema } from '../users/schemas/users.schema';


@Schema({ timestamps: true })
export class BaseSchema {
    
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
