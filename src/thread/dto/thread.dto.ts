import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDto } from 'src/user/dto';

export class ThreadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  authorId: number;


  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  likes: number;

  @IsString()
  @IsOptional()
  dislikes: number;

  comments: number;

  @IsNotEmpty()
  topics: string[];
}
