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
      try {
        const checkExistsCompany = await this.companyModel.findOne({name:createCompanyDto})
        if(checkExistsCompany){
          return {
            statusCode : 409,
            message: 'Company already exits'
          }
        }
        await this.companyModel.create({
          createCompanyDto,
          createdAt: now()
        }) 
        return {
          statusCode :201,
          message: 'Created new company successfully'
        }

      }catch(err){
        console.log(err)
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
