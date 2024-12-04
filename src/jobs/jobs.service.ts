import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import mongoose from 'mongoose';
dayjs().format();
@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
 async create(createJobDto: CreateJobDto , user: IUser) {
    const {  startDate, endDate } = createJobDto
     if(!dayjs(endDate).isAfter(dayjs(startDate))){
      throw new BadRequestException('End date is not valid')
     }

    let newJob = await this.jobModel.create({...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

  return {
    _id: newJob._id,
    createdAt: newJob.createdAt  
    }
  } 


 async findAll(currentPage:number, limit:number ,qs:string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit: 10
    const totalItems = (await this.jobModel.find(filter)).length
    const totalPage = Math.ceil(totalItems / defaultLimit)

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any )
      .populate(population)
      .exec()

    return {
      meta:{ 
        current: currentPage,
        pageSize: defaultLimit,
        total: totalItems,
        totalPage
      },
      result
    }

  }

  async findOne(id: string) {
    const job = await this.jobModel.findById(id)
    if(!job || job.isDeleted){
      throw new NotFoundException('Job not found')
    }
    return job
  }

  async update(id: string, updateJobDto: UpdateJobDto,user:IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found resume with id=${id}`);
      return await this.jobModel.updateOne({_id:id},{...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`Not found resume with id=${id}`);
    await this.jobModel.updateOne({_id:id}, {
      deletedByBy:{
        _id: user._id,
        email: user.email
      }
    })
    return await this.jobModel.softDelete({_id:id})
  }
}
