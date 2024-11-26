import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema'; 
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IUser } from 'src/users/users.interface';
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
          err 
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
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

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
