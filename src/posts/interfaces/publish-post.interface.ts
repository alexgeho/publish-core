export interface PublishPost {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  coverImage?: string;
  galleryImages?: string[];
  slug: string; 
}