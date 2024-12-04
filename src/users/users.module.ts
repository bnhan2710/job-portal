import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schemas';
@Module({
  imports: [MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name , schema: RoleSchema }
  ])],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
