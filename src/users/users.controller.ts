  import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.usersService.create(createUserDto);
      if (result.statusCode !== 201) {
        throw new HttpException(result.message, result.statusCode);
      }
      return result.user;
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', error.statusCode || 500);
    }
  }

  @Get()
  @HttpCode(200)
  async findAll() {
    try {
      const result = await this.usersService.findAll();
      if (result.statusCode !== 200) {
        throw new HttpException(result.message, result.statusCode);
      }
      return result.users;
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', error.statusCode || 500);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.usersService.findOne(id);
      if (result.statusCode !== 200) {
        throw new HttpException(result.message, result.statusCode);
      }
      return result.user;
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', error.statusCode || 500);
    }
  }

  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.usersService.update(id, updateUserDto);
      if (result.statusCode !== 200) {
        throw new HttpException(result.message, result.statusCode);
      }
      return result.message;
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', error.statusCode || 500);
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    try {
      const result = await this.usersService.remove(id);
      if (result.statusCode !== 200) {
        throw new HttpException(result.message, result.statusCode);
      }
      return result.message;
    } catch (error) {
      throw new HttpException(error.message || 'Internal server error', error.statusCode || 500);
    }
  }
}
