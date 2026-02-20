import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

/*
  Controller handles incoming HTTP requests.
  All routes here will start with /posts.
*/
@Controller('posts')
export class PostsController {

  /*
    Inject PostsService to delegate business logic.
    Controller should not contain logic itself.
  */
  constructor(private readonly postsService: PostsService) {}

  /*
    POST /posts
    Creates a new scheduled post.
    Expects title, content, and publishAt in request body.
  */
@Post()
create(@Body() body: CreatePostDto) {
  return this.postsService.create(
    body.title,
    body.content,
    new Date(body.publishAt),
  );
}

  /*
    GET /posts
    Returns all stored posts.
    Used mainly for testing and debugging.
  */
  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}