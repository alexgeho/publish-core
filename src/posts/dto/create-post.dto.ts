import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

  @ApiProperty({ example: 'My first article' })
  title: string;

  @ApiProperty({ example: 'A few important words to spark interest...' })
  excerpt: string;

  @ApiProperty({ example: 'This is article content...' })
  content: string;

  @ApiProperty({ example: '2026-02-21T10:00:00.000Z' })
  date: string;
  
}