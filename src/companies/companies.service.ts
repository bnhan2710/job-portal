import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema'; 
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import { log } from 'console';
@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) 
  private companyModel: SoftDeleteModel<CompanyDocument>) {}
  async create(createCompanyDto: CreateCompanyDto, user:IUser) {
      const existCompany = await this.companyModel.findOne({ name: createCompanyDto.name });
      if(existCompany){
        throw new ConflictException('Company already exits')
      }
      const newCompany = await this.companyModel.create({...createCompanyDto,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
      return {
        _id:newCompany._id,
        createdAt: newCompany.createdAt
      };
  }
  
  async findAll(currentPage:number, limit:number, qs:string ) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    
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
    const company = await this.companyModel.findById(id)
    if(!company || company.isDeleted) {
      throw new NotFoundException('Company Not Found');
    }
    return company
}
    
  
  async update(id: string, updateCompanyDto: UpdateCompanyDto, user : IUser) {
      const company = await this.companyModel.findById(id)
      if(!company || company.isDeleted){
        throw new NotFoundException('Company Not Found')
      }
    return await this.companyModel.updateOne({ _id: id }, {...updateCompanyDto, 
      updatedBy: {
        _id:user._id,
        email: user.email
      }})  
  }

  async remove(id: string, user: IUser) {
        const company = await this.companyModel.findById(id)
        if(!company || company.isDeleted){
          throw new NotFoundException('Company Not Found')
        }
        await this.companyModel.updateOne({_id:id}, 
          {
            deletedBy:
            {
              _id:user._id,
              email: user.email
            }
        })
        return await this.companyModel.softDelete({_id:id})
  }
}
