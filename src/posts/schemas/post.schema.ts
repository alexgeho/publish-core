import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  excerpt: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ default: 'draft' })
  status: 'draft' | 'published';
}

export const PostSchema = SchemaFactory.createForClass(Post);