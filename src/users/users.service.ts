import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { Model, now } from 'mongoose';
import { genSaltSync, hashSync ,compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) 
    private userModel: SoftDeleteModel<UserDocument>) {}

    private genHashPassword(password: string): string {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }

    async create(createUserDto: CreateUserDto) {
      try {
          const existingUser = await this.userModel.findOne({ email: createUserDto.email });
          if (existingUser) {
              return {
                  statusCode: 409,
                  message: 'User with this email already exists',
              };
          }
  
          const hashPassword = this.genHashPassword(createUserDto.password);
          const user = await this.userModel.create({
              ...createUserDto,
              createdAt: now(),
              password: hashPassword
          });
          const {password,...other} = user
          return {
              statusCode: 201,
              message: 'User created successfully',
              user,
          };
      } catch (error) {
          return {
              statusCode: 500,
              message: 'Create User Failed',
              err: error,
          };
      }
  }
  
  async findAll() {
    try {
        const users = await this.userModel.find();
        if (!users || users.length === 0) {
            return {
                statusCode: 404,
                message: 'There are no users',
            };
        }
        const usersWithoutPassword = users.map(user => {
            const { password, ...other } = user.toObject();
            return other;
        });
        return {
            statusCode: 200,
            users: usersWithoutPassword,
        };
    } catch (error) {
        return {
            statusCode: 500,
            message: 'Find All Users Failed',
        };
    }
}


    async findOne(id: string) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                return {
                    statusCode: 404,
                    message: 'User Not Found'
                };
            }
            const { password, ...other } = user.toObject();
            return {
                statusCode: 200,
                user: other
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Find User Failed',
                err: error,
            };
        }
    }
     
    async findOnebyUsername(username:string){
        return this.userModel.findOne({
            email:username
        })
    }

    async checkUserPassword(password:string,hash:string){
     return await compareSync(password,hash)
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            const update = await this.userModel.updateOne({ _id: id }, { $set: updateUserDto });
            if (update.modifiedCount === 0) {
                return {
                    statusCode: 404,
                    message: 'User Not Found or No Changes Made',
                };
            }
            return {
                statusCode: 200,
                message: 'Update Successfully',
                metadata: update,
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Update Failed',
                err: error,
            };
        }
    }

    async remove(id: string) {
        try {
            const deleteResult = await this.userModel.softDelete({_id:id})
            if (deleteResult.deleted === 0) {
                return {
                    statusCode: 404,
                    message: 'User Not Found'
                };
            }
            return {
                statusCode: 200,
                message: 'User Removed Successfully',
            };
        } catch (error) {
            return {
                statusCode: 500,
                message: 'Remove Failed',
                err: error,
            };
        }
    }
}
