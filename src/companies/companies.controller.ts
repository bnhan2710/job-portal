import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Req, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Post()
  @ResponseMessage("Create a Company")
  create(@Body() createCompanyDto: CreateCompanyDto , @User() user:IUser ) {
      return this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch list company with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.companiesService.findAll(+currentPage,+limit,qs );
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Getdetail Company")
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }
  
  @Patch(':id')
  @ResponseMessage("Update Company")
  update(@Param('id') id: string,
  @Body() updateCompanyDto: UpdateCompanyDto,
  @User() user: IUser) {
    return this.companiesService.update(id,updateCompanyDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Remove Company")
  remove(@Param('id') id: string, @User() user:IUser ) {
    return this.companiesService.remove(id, user);
  }
}
