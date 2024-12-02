import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsIn } from 'class-validator';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsIn(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'])
    status: string;
  }