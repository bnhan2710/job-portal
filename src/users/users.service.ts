import { BadGatewayException, BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import mongoose, { Model, now } from 'mongoose';
import { genSaltSync, hashSync ,compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { NotFoundError } from 'rxjs';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) 
    private userModel: SoftDeleteModel<UserDocument>) {}

    private genHashPassword(password: string): string {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }

    async create(createUserDto: CreateUserDto) {
        const isExist = await this.userModel.findOne({email:createUserDto.email})
        if(isExist){
            throw new BadRequestException('Email already exist!')
        }
        const hashPassword = this.genHashPassword(createUserDto.password)
        const user = await this.userModel.create({
            ...createUserDto,
            password:hashPassword
        })
        const {_id, createdAt} = user 
        return {
            _id,
            createdAt
        }
  }
  
  async register(registerDto: RegisterDto){
        const emailExist = await this.findOnebyUsername(registerDto.email)
        if(emailExist){
            throw new BadRequestException('Email already exist!')
        }
        const hashPassword = this.genHashPassword(registerDto.password)
          return await this.userModel.create({
            ...registerDto,
            password:hashPassword,
            role: 'USER'
        })
}

  async findAll(currentPage: number,limit: number, qs: string) {
    const {filter, skip, sort, projection, population } = aqp(qs)
    delete filter.page;
    delete filter.limit

    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit: 10
    const totalItems = (await this.userModel.find(filter)).length
    const totalPage = Math.ceil(totalItems / defaultLimit)

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any )
      .select('-password')
      .populate(population)
      .exec()

    return {
      metadata:{ 
        current: currentPage,
        pageSize: limit,
        total: totalItems,
        totalPage
      },
      result
    }
    
}


async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return `Not found user with id ${id}`
    return this.userModel.findOne({
      _id: id
    })
      .select("-password")
      .populate({ path: "role", select: { name: 1, _id: 1 } })
  }
     
    async findOnebyUsername(username:string){
        return this.userModel.findOne({
            email: username
          }).populate({ path: "role", select: { name: 1 } })
    }

    async checkUserPassword(password:string,hash:string){
     return await compareSync(password,hash)
    }

    async update(id: string, updateUserDto: UpdateUserDto ,user: IUser ) {
        const existUser = await this.userModel.findById(id)
        if(!existUser || existUser.$isDeleted){
            throw new NotFoundException('User not found')
        }
        return await this.userModel.updateOne({_id:id},
            {
                ...updateUserDto,
                updatedBy:{
                    _id: user._id,
                    email: user.email
                }
            })
    }

    async remove(id: string, user: IUser ) {
        const existUser = await this.userModel.findById(id)
        if(!existUser){
            throw new NotFoundException('User not found')
        }
        await this.userModel.updateOne(
            { _id: id },
            {
              deletedBy: {
                _id: user._id,
                email: user.email
              }
            })
          return this.userModel.softDelete({
            _id: id,
          })
    }   
}
