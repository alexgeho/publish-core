import { Injectable } from '@nestjs/common';
import { PublishPost } from './interfaces/publish-post.interface';
import { GitHubService } from '../github/github.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PublisherService {

  constructor(private readonly gitHubService: GitHubService) {}

  async publish(post: PublishPost) {

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

    await this.gitHubService.createOrUpdateFile(
      `blogg/${slug}.html`,
      html,
      `feat(blog): publish ${slug}`,
    );

    await this.updateHomePage(post, slug);
  }

  private async updateHomePage(post: PublishPost, slug: string) {

    const filePath = 'index.html';

    const existingFile = await this.gitHubService.getFileContent(filePath);

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

    const before = existingFile.split(startMarker)[0] + startMarker;
    const middle = existingFile.split(startMarker)[1].split(endMarker)[0];
    const after = endMarker + existingFile.split(endMarker)[1];

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

    await this.gitHubService.createOrUpdateFile(
      filePath,
      updatedHtml,
      `feat(blog): update homepage`,
    );
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