import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PublisherService } from './publisher.service';

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
    constructor(
        private readonly postsService: PostsService,
        private readonly publisherService: PublisherService
    ) { }

    @Get('publish-test')
    publishTest() {
        this.publisherService.publish({
            title: 'Test post',
            excerpt: 'Kort beskrivning...',
            content: '<p>Detta är en testartikel.</p>',
            date: '21 Feb 2026',
            slug: 'test-post'
        });

        return { ok: true };
    }

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