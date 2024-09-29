import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema'; 
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { now } from 'mongoose';
@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) 
  private companyModel: SoftDeleteModel<CompanyDocument>) {}
  async create(createCompanyDto: CreateCompanyDto) {
    try{
      const existingCompany = await this.companyModel.findOne({ name: createCompanyDto.name });
      if(existingCompany){
        return {
          statusCode: 409,
          message: 'Company with this name already exists',
        };
      }
      const company = new this.companyModel(createCompanyDto);
      const createdCompany = await company.save();
      return createdCompany;
    }catch(error){
      return error
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
