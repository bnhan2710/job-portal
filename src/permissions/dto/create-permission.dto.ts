import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {

    @IsNotEmpty({message: 'Name cannot be empty'})
    name: string

    @IsNotEmpty({message: 'apiPath cannot be empty'})
    apiPath: string 

    @IsNotEmpty({message: 'Method cannot be empty'})
    method: string

    @IsNotEmpty({message: 'Module cannot be empty'})
    module: string 
}
