import { BadRequestException, Injectable, Param } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume,ResumeDocument } from './schemas/resume.schema';
import aqp from 'api-query-params'
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';
import * as path from 'node:path';


@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}


  async create(createResumeDto: CreateResumeDto, user: IUser) {
      const newResume = await this.resumeModel.create({
        ...createResumeDto,
        email: user.email,
        userId: user._id,
        status: 'PENDING',
        history: [
          {
            status: "PENDING",
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }

          } 
        ],
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })

      return {
        _id: newResume._id,
        createdAt: newResume.createdAt
      }
  }

  async findAll(currentPage:number, limit: number ,qs : string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    
    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit: 10
    const totalItems = (await this.resumeModel.find(filter)).length
    const totalPage = Math.ceil(totalItems / defaultLimit)

    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any )
      .select(projection as any)
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

  async findOne(id: string){
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found resume with id=${id}`);
    return await this.resumeModel.find({ _id: id })
  }
  
  async findOneByUser(user:IUser){
    return await this.resumeModel
    .find({userId: user._id})
    .sort('-createdAt')
    .populate([
      {
        path: 'companyId',
        select: {name: 1}
      },
      {
        path: 'jobId',
        select: {name: 1}
      },
    ])
  }

  async update(id: string, updateResumeDto: UpdateResumeDto,user: IUser) {
    const resume = await this.resumeModel.find({_id: id})
    if(!resume){
      throw new BadRequestException(`Not found resume with id = ${id}`)
    }
    return await this.resumeModel.updateOne({_id:id},{
      status:updateResumeDto.status,
      ...updateResumeDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      },
      $push:{
        history: {
          status: updateResumeDto.status,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      }
    })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found resume with id=${id}`);
    await this.resumeModel.updateOne({_id: id},{
      updatedBy:{
        _id: user._id,
        email: user.email
      }
    })
    return await this.resumeModel.softDelete({_id:id})
  }  
}
