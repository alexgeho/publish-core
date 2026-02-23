import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {

  constructor(
    private readonly postsService: PostsService,
  ) {}

  // Save post to MongoDB as draft
  @Post()
  @ApiOperation({ summary: 'Save post as draft' })
  async create(@Body() body: CreatePostDto) {
    return this.postsService.create(body);
  }

  // Get all drafts for admin panel
  @Get('drafts')
  @ApiOperation({ summary: 'Get all drafts' })
  async findDrafts() {
    return this.postsService.findDrafts();
  }

  // Publish draft to site by MongoDB id
  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish draft to site' })
  async publish(@Param('id') id: string) {
    await this.postsService.publishDraft(id);
    return { ok: true };
  }

  // Get all posts
  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  async findAll() {
    return this.postsService.findAll();
  }
}