import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PublisherService } from './publisher.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {

  constructor(
    private readonly postsService: PostsService,
    private readonly publisherService: PublisherService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Publish a new blog post to the site' })
  create(@Body() body: CreatePostDto) {
    this.publisherService.publish(body);
    return { ok: true };
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}