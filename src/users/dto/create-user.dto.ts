import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company{
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    name: string
}

export class CreateUserDto {
    
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name: string;
 
    @IsEmail({}, { message: 'Email must be a valid email address'})
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
    
    @IsNotEmpty({message: 'Role cannot be empty'})
    role:string

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

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


