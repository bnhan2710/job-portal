import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema'; 
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) 
  private companyModel: SoftDeleteModel<CompanyDocument>) {}
  async create(createCompanyDto: CreateCompanyDto, user:IUser) {
    try{
      const existCompany = await this.companyModel.findOne({ name: createCompanyDto.name });
      if(existCompany){
        throw new ConflictException('Company already exits')
      }
      const company = new this.companyModel({...createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
      const createdCompany = await company.save();
      return createdCompany;
    }catch(err){
          return err
    }
  }
  
  async findAll(currentPage:number, limit:number, qs:string ) {
    const {filter, skip, sort, projection, population } = aqp(qs)
    delete filter.current;
    delete filter.pageSize
    let offset = (currentPage - 1) * (limit);
    let defaultLimit = limit ? limit: 10
    const totalItems = (await this.companyModel.find(filter)).length
    const totalPage = Math.ceil(totalItems / defaultLimit)

    const result = await this.companyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any )
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
    try{
    const company = await this.companyModel.findById(id)
    if(!company) {
      throw new NotFoundException('Company Not Found');
    }
    }catch(err){
    return err
}
    } 
  
  async update(id: string, updateCompanyDto: UpdateCompanyDto, user : IUser) {
    try{  
      const company = await this.companyModel.findById(id)
      if(!company){
        throw new NotFoundException('Company Not Found')
      }
    return await this.companyModel.updateOne({ _id: id }, {...updateCompanyDto, 
      createdBy: {
        _id:user._id,
        email: user.email
      }})  
    }catch(err){
      return err
    }
  }

  async remove(id: string, user: IUser) {
      try{
        const company = await this.companyModel.findById(id)
        if(!company){
          throw new NotFoundException('Company Not Found')
        }
        return await this.companyModel.updateOne({_id:id}, 
          {
            deletedBy:
            {
              _id:user._id,
              email: user.email
            },
            isDeleted: true,
            deletedAt: new Date()
          })
      }catch(err){
        return err
      }
  }
}
