import { thread } from '@prisma/client';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserDto } from 'src/user/dto';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  authorId: string;

  // @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNumber()
  likes: number;

  @IsNumber()
  dislikes: number;

  @IsNumber()
  @IsNotEmpty()
  threadId: string;

  @IsNotEmpty()
  modified: boolean;

  comments: number;
}
