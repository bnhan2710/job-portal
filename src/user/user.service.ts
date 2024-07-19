import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import {genSaltSync,hashSync} from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    genHashPassword(password: string): string {
      const salt = genSaltSync(10);
      const hash = hashSync(password, salt);
      return hashSync(password, salt);
  }

  async create(createUserDto: CreateUserDto) {
        const hashPassword = this.genHashPassword(createUserDto.password)
        
        const user = await this.userModel.create({
          ...createUserDto,
          password: hashPassword
        })
          return user;
        }


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
