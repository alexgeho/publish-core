import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {PublishPost} from './interfaces/publish-post.interface'

const SITE_PATH = '/Users/alexandergerhard/SEObygg/Tak';

const BLOG_PATH = path.join(SITE_PATH, 'blogg');

@Injectable()
export class PublisherService {

  publish(post: PublishPost) {

    const slug = this.generateSlug(post.title);

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'post.template.html'
    );

    const template = fs.readFileSync(templatePath, 'utf-8');

    const html = template
      .replace(/{{title}}/g, post.title)
      .replace(/{{excerpt}}/g, post.excerpt)
      .replace(/{{date}}/g, post.date)
      .replace(/{{content}}/g, post.content);

    const outputPath = path.join(
      BLOG_PATH,
      `${slug}.html`
    );

    fs.writeFileSync(outputPath, html);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/å|ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}

