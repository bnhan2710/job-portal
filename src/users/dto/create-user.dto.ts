import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Email must be a valid email address ' })
    @IsNotEmpty({ message: 'Email should not be empty' })
    email: string;
    
    @IsNotEmpty({ message: 'Password should not be empty' })
    password: string;
    
    name: string;
    
    address: string;
}
