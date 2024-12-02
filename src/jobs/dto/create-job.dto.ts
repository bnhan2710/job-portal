import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo:string
}
export class CreateJobDto {

    @IsNotEmpty({
        message: "Name cannot be empty"
    })
    name: string;
    
    @IsNotEmpty({
        message: "Skill cannot be empty"
    })
    @IsArray({ message: "Skill must be a Araay" })
    @IsString({ each: true, message: "Skill must be a String" })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company

    @IsNotEmpty({
        message: "Location cannot be empty"
    })
    location: string;


    @IsNotEmpty({
        message: "Salary cannot be empty"
    })
    salary: number;


    @IsNotEmpty({
        message: "Quantity cannot be empty"
    })
    quantity: number;


    @IsNotEmpty({
        message: "Level cannot be empty"
    })
    level: string;


    @IsNotEmpty({
        message: "Description cannot be empty"
    })
    description: string;

    @IsNotEmpty({
        message: "startDate cannot be empty"
    })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "startDate must be Date" })
    startDate: Date;

    @IsNotEmpty({
        message: "endDate cannot be empty"
    })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "endDate must be Date" })
    endDate: Date;

    @IsNotEmpty({
        message: "isActive cannot be empty"
    })
    @IsBoolean({ message: "isActive must be Boolean" })
    isActive: boolean;
}