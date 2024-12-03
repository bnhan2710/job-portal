import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import * as path from 'node:path';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>
  ) {}

async create(createPermissionDto: CreatePermissionDto, user: IUser) {

        const [existPermission] = await this.permissionModel.find({apiPath: createPermissionDto.apiPath})
        if(existPermission && existPermission.method === createPermissionDto.method)
        {
          throw new BadRequestException(`Permission with apiPath =${createPermissionDto.apiPath}, method = ${createPermissionDto.method} already exist`)
        }

        const newPermission = await this.permissionModel.create({
          ...createPermissionDto,
          createdBy: {
            _id: user._id,
            email: user.email
          }
        })

        return {
          _id: newPermission._id,
          createdAt: newPermission.createdAt
        }
  }

  async findAll(currentPage: number,limit: number, qs: string) {
    const {filter, skip, sort, projection, population } = aqp(qs)
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit: 10
    const totalItems = (await this.permissionModel.find(filter)).length
    const totalPage = Math.ceil(totalItems / defaultLimit)

    const result = await this.permissionModel.find(filter)
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
      throw new NotFoundException(`Not found user with id = ${id}`)

    return await this.permissionModel.findOne({_id:id})
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto,user:IUser) {
      return await this.permissionModel.updateOne({_id: id},{
        ...updatePermissionDto,
        updatedBy:{
          _id: user._id,
          email: user.email
          }
      })
  }

 async remove(id:string , user:IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException(`Not found permission with id = ${id}`)
    await this.permissionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return this.permissionModel.softDelete({
      _id: id,
    })
  }
}
