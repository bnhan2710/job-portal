import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from '../users/users.interface';
import { ResponseMessage, User } from '../decorator/customize';
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create a new Role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto,user);
  }

  @Get()
  @ResponseMessage('Fetch role with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string
  ) {
    return this.rolesService.findAll(+currentPage,+limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Updated Role')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user:IUser
  ) {
    return this.rolesService.update(id, updateRoleDto,user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.rolesService.remove(id,user);
  }
}
