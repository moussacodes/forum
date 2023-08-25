import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  authorId: string;

  // @IsNotEmpty()
  createdAt: Date;

  likes: number;

  dislikes: number;

  threadId: string;

  modified: boolean;

  replies: number;
}
