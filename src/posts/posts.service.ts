import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { PublisherService } from './publisher.service';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly publisherService: PublisherService,
  ) { }

  async deletePublishedPost(slug: string) {
    await this.publisherService.deletePost(slug);
  }

  async create(dto: CreatePostDto): Promise<Post> {

    const slug = dto.title
      .toLowerCase()
      .replace(/å|ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    return this.postModel.create({
      ...dto,
      slug,
      status: 'draft'
    });
  }

  async findPublished(): Promise<Post[]> {
    return this.postModel
      .find({ status: 'published' })
      .sort({ createdAt: -1 });
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ createdAt: -1 });
  }

  async findDrafts(): Promise<Post[]> {
    return this.postModel.find({ status: 'draft' }).sort({ createdAt: -1 });
  }

  async publishDraft(id: string) {

    const draft = await this.postModel.findById(id);

    if (!draft) {
      throw new Error('Draft not found');
    }

    const galleryImagesArray = draft.galleryImages || [];

    await this.publisherService.publish({
      title: draft.title,
      excerpt: draft.excerpt,
      date: draft.date,
      content: draft.content,
      coverImage: draft.coverImage,
      galleryImages: galleryImagesArray,
      slug: draft.slug
    });

    await draft.deleteOne();
  }
}