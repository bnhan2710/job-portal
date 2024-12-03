import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { UserSchema,User } from '../users/schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../permissions/schemas/permission.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schemas';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService],
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: Permission.name, schema: PermissionSchema },
    { name: Role.name, schema: RoleSchema },
  ])],
})
export class DatabasesModule {}
