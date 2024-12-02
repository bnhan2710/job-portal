import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {

    @IsNotEmpty({message: 'Url cannot be empty'})
    @IsString({message: 'Url must be string'})
    url:string

    @IsNotEmpty({message: 'companyId cannot be empty'})
    @IsMongoId({message: 'companyId must be MongoId'})
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({message: 'jobId cannot be empty'})
    @IsMongoId({message: 'jobId must be MongoId'})
    jobId: mongoose.Schema.Types.ObjectId

}
