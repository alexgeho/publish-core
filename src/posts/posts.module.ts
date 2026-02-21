import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PublisherService } from './publisher.service';


@Module({
  controllers: [PostsController],
providers: [PostsService, PublisherService]
})
export class PostsModule {}
