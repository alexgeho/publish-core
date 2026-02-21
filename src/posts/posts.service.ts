import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>
  ) {}

  // Save new post to MongoDB with draft status
  async create(dto: CreatePostDto, slug: string): Promise<Post> {
    return this.postModel.create({ ...dto, slug, status: 'draft' });
  }

  // Return all posts sorted by newest first
  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 });
  }

  // Return only drafts for admin panel
  async findDrafts(): Promise<Post[]> {
    return this.postModel.find({ status: 'draft' }).sort({ createdAt: -1 });
  }

  // Mark post as published
  async markPublished(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(
      id,
      { status: 'published' },
      { new: true }
    );
  }
}