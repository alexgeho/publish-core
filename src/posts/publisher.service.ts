import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PublisherService {

  publish(post: any) {
    const templatePath = path.join(__dirname, '../../templates/post.template.html');
    const template = fs.readFileSync(templatePath, 'utf-8');

    const html = template
      .replace(/{{title}}/g, post.title)
      .replace(/{{excerpt}}/g, post.excerpt)
      .replace(/{{date}}/g, post.date)
      .replace(/{{content}}/g, post.content);

    const outputPath = path.join(
      __dirname,
      '../../../VillaTak/blogg',
      `${post.slug}.html`
    );

    fs.writeFileSync(outputPath, html);
  }
}