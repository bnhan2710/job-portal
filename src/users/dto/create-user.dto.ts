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
    
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;
 
    @IsEmail({}, { message: 'Email must be a valid email address ' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;
    
    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;
    
    @IsNotEmpty({message: 'Age should not be empty'})
    age: number

    @IsNotEmpty({message: 'Gender should not be empty'})
    gender: string

    @IsNotEmpty({message: 'Address should not be empty'})
    address: string
    
    @IsNotEmpty({message: 'Role should not be empty'})
    role:string

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}

export class RegisterDto {
    
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;
 
    @IsEmail({}, { message: 'Email must be a valid email address ' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;
    
    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;
    
    @IsNotEmpty({message: 'Age should not be empty'})
    age: number

    @IsNotEmpty({message: 'Gender should not be empty'})
    gender: string

    @IsNotEmpty({message: 'Address should not be empty'})
    address: string
    
}


