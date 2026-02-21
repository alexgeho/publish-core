import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PublisherService } from './publisher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),  // ← добавь
  ],
  controllers: [PostsController],
  providers: [PostsService, PublisherService]
})
export class PostsModule { }
