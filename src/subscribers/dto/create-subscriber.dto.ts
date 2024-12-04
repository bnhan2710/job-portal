import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { BaseSchema } from "../../common/base.schema";

export class CreateSubscriberDto extends BaseSchema{
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    name:string

    @IsNotEmpty()
    @IsArray()
    @IsString({each:true})
    skills: string[]
}
