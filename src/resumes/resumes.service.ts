import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume,ResumeDocument } from './schemas/resume.schema';
import aqp from 'api-query-params'
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';


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
      throw new BadRequestException(`Not found resume with id=${id}`);
     await this.resumeModel.findOne({ _id: id }).lean();
     return
  }
  
  async update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  async remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
