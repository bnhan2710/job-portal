import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";
export class CompanyValidate {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;
  
    @IsNotEmpty()
    name: string;
  }
  
export class CreateUserDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    @ApiProperty({
      example: 'yourEmail@gmail.com',
      description: 'username is email',
    })
    email: string;
  
    @IsNotEmpty({ message: 'Password is required' })
    @ApiProperty({ example: '123456' })
    password: string;
  
    @IsNotEmpty({ message: 'Name is required' })
    @ApiProperty({ example: 'Guest' })
    name: string;
  
    @IsNotEmpty({ message: 'Age is required' })
    @ApiProperty({ example: 18 })
    age: number;
  
    @IsNotEmpty({ message: 'Gender is required' })
    @ApiProperty({ example: 'male' })
    gender: string;
  
    @IsNotEmpty({ message: 'Address is required' })
    @ApiProperty({ example: 'Vietnam' })
    address: string;
  
    @IsNotEmpty({ message: 'Role is required' })
    @IsMongoId()
    role: string;
  
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => CompanyValidate)
    company: CompanyValidate;
  }

export class RegisterDto {
    
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name: string;
 
    @IsEmail({}, { message: 'Email must be a valid email address ' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;
    
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;
    
    @IsNotEmpty({message: 'Age cannot be empty'})
    age: number

    @IsNotEmpty({message: 'Gender cannot be empty'})
    gender: string

    @IsNotEmpty({message: 'Address cannot be empty'})
    address: string
    
}

export class LoginUserDto {
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    @ApiProperty({ example: 'admin@gmail.com', description: 'Email is username' })
    username: string;
  
    @IsNotEmpty({ message: 'Password is required' })
    @ApiProperty({ example: '123456' })
    password: string;
  }