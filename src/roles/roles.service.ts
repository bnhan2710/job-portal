import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from '../databases/sample';
@Injectable()
export class RolesService {

  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>
  ){}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    // console.log(createRoleDto)
      const [isExist] = await this.roleModel.find({name:createRoleDto.name})
      if(isExist){
        throw new BadRequestException('Role name already exist')
      }
      const newRole = await this.roleModel.create({
        ...createRoleDto,
        createdBy:{
          _id: user._id,
          email: user.email
        }
      })

      return {
        _id: newRole._id,
        createdAt: newRole.createdAt
      }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const {filter, sort, population } = aqp(qs)
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 10
    const totalItems = (await this.roleModel.find(filter)).length
    const totalPage = Math.ceil(totalItems / defaultLimit)

    const result = await this.roleModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any )
    .populate(population)
    .exec()

  return {
    meta:{ 
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
      throw new NotFoundException(`Not found permission with id = ${id}`)
    return await this.roleModel.findOne({_id:id})
    .populate({path: "permissions", select: {_id:1, apiPath:1,name: 1, method:1, module:1 }})
  }

  async update(id: string, updateRoleDto: UpdateRoleDto,user:IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found resume with id=${id}`
      );
    }
    return await this.roleModel.updateOne({_id:id},{
      ...updateRoleDto,
      updatedBy:{
        _id:user._id,
        email: user.email
      }
    })

  }

 async remove(id: string,user: IUser) {
  const foundRole = await this.roleModel.findById(id)
    
    if(!foundRole){
      throw new NotFoundException('Role not found')
    }

    if(foundRole.name === ADMIN_ROLE ){
      throw new BadRequestException('Cannot delete role Admin')
    }

    await this.roleModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.roleModel.softDelete({
      _id: id,
    })
  }
}
