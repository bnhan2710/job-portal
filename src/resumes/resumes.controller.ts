import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage } from '../decorator/customize';
import { IUser } from '../users/users.interface';
import { User } from '../decorator/customize';
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new Resume')
  create(
    @Body() createResumeDto: CreateResumeDto,
    @User() user: IUser) {
    return this.resumesService.create(createResumeDto,user);
  }

  @Get()
  @ResponseMessage('Fetch resume with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch resume by Id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Post('by-user')
  @ResponseMessage('Fetch resume by Id')
  findOneByUser(@User() user: IUser) {
    return this.resumesService.findOneByUser(user);
  }


  @Patch(':id')
  @ResponseMessage('Updated resume')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser)
    {
    return this.resumesService.update(id, updateResumeDto,user);
  }

  @Delete(':id')
  @ResponseMessage('Removed resumes')
  remove(@Param('id') id: string ,@User() user: IUser) {
    return this.resumesService.remove(id,user);
  }
}
 