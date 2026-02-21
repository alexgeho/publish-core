import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PublishPost } from './interfaces/publish-post.interface';

const SITE_PATH = '/Users/alexandergerhard/SEObygg/Tak';
const BLOG_PATH = path.join(SITE_PATH, 'blogg');
const INDEX_PATH = path.join(SITE_PATH, 'index.html');

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

    const outputPath = path.join(BLOG_PATH, `${slug}.html`);

    fs.writeFileSync(outputPath, html);

    this.updateHomePage(post, slug);
  }

  private updateHomePage(post: PublishPost, slug: string) {

    const indexFile = fs.readFileSync(INDEX_PATH, 'utf-8');

    const newCard = `
<li class="blog-item">
  <h3>
    <a href="/blogg/${slug}.html">${post.title}</a>
  </h3>
  <p class="blog-date">${post.date}</p>
  <p>${post.excerpt}</p>
  <a href="/blogg/${slug}.html">Läs mer →</a>
</li>
`;

    const startMarker = '<!-- BLOG_HOME_START -->';
    const endMarker = '<!-- BLOG_HOME_END -->';

    const before = indexFile.split(startMarker)[0] + startMarker;
    const middle = indexFile.split(startMarker)[1].split(endMarker)[0];
    const after = endMarker + indexFile.split(endMarker)[1];

    const existingCards = middle
      .split('<li class="blog-item">')
      .filter(s => s.trim().length > 0)
      .map(card => '<li class="blog-item">' + card.trim());

    const updatedCards = [newCard.trim(), ...existingCards].slice(0, 7);

    const updatedHtml =
      before +
      '\n' +
      updatedCards.join('\n') +
      '\n' +
      after;

    fs.writeFileSync(INDEX_PATH, updatedHtml);
  }

  public generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/å|ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}