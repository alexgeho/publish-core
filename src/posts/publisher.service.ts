import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { PublishPost } from './interfaces/publish-post.interface';

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}

  async publish(post: PublishPost) {
    const slug = this.generateSlug(post.title);

    const createdPost = new this.postModel({
      ...post,
      slug,
      status: 'published',
    });

    return createdPost.save();
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/å|ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}