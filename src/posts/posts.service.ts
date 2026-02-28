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


  /* FOR NEXT-JS */
  async findBySlug(slug: string, site: string): Promise<Post | null> {
    return this.postModel.findOne({ slug, status: 'published', site });
  }
  /* FOR NEXT-JS END*/

  async deletePublishedPost(slug: string) {
    await this.publisherService.deletePost(slug);
    await this.postModel.deleteOne({ slug });
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

  async findPublished(site: string): Promise<Post[]> {
    return this.postModel
      .find({ status: 'published', site })
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

    await this.publisherService.publish({
      title: draft.title,
      excerpt: draft.excerpt,
      date: draft.date,
      content: draft.content,
      coverImage: draft.coverImage,
      galleryImages: draft.galleryImages || [],
      slug: draft.slug,
      site: draft.site
    });

    draft.status = 'published';
    await draft.save();
  }
}