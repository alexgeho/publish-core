import { Injectable } from '@nestjs/common';
import { PublishPost } from './interfaces/publish-post.interface';
import { GitHubService } from '../github/github.service';
import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';

@Injectable()
export class PublisherService {

  constructor(private readonly gitHubService: GitHubService) { }

  async deletePost(slug: string) {
    await this.gitHubService.deleteFile(
      `blog/${slug}.html`,
      `chore(blog): delete ${slug}`
    );
    await this.removeFromHomePage(slug);
  }

  private async removeFromHomePage(slug: string) {
    const filePath = 'index.html';
    const existingFile = await this.gitHubService.getFileContent(filePath);

    const startMarker = '<!-- BLOG_HOME_START -->';
    const endMarker = '<!-- BLOG_HOME_END -->';

    const before = existingFile.split(startMarker)[0] + startMarker;
    const middle = existingFile.split(startMarker)[1].split(endMarker)[0];
    const after = endMarker + existingFile.split(endMarker)[1];

    const existingCards = middle
      .split('<li class="blog-item">')
      .filter(function (s) { return s.trim().length > 0; })
      .map(function (card) { return '<li class="blog-item">' + card.trim(); });

    const filteredCards = existingCards.filter(function (card) {
      return !card.includes('/blog/' + slug + '.html');
    });

    const updatedHtml = before + '\n' + filteredCards.join('\n') + '\n' + after;

    await this.gitHubService.createOrUpdateFile(
      filePath,
      updatedHtml,
      'chore(blog): remove ' + slug + ' from homepage',
    );
  }

  async publish(post: PublishPost) {

    const slug = post.slug;

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'post.template.html'
    );

    const template = fs.readFileSync(templatePath, 'utf-8');

    const coverImageHtml = post.coverImage
      ? `<div class="blog-image">
           <img src="${post.coverImage}" alt="${post.title}" class="blog-cover">
         </div>`
      : '';

    const galleryHtml = post.galleryImages && post.galleryImages.length
      ? `
        <div class="blog-gallery">
          ${post.galleryImages
        .map(function (img: string) { return `<img src="${img}" alt="">`; })
        .join('')}
        </div>
        `
      : '';

    const parsedContent = await marked.parse(post.content);

    const html = template
      .replace(/{{title}}/g, post.title)
      .replace(/{{excerpt}}/g, post.excerpt)
      .replace(/{{date}}/g, post.date)
      .replace(/{{image}}/g, coverImageHtml)
      .replace(/{{gallery}}/g, galleryHtml)
      .replace(/{{content}}/g, parsedContent);

    await this.gitHubService.createOrUpdateFile(
      `blog/${slug}.html`,
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
    <a href="/blog/${slug}.html">${post.title}</a>
  </h3>
  <p class="blog-date">${post.date}</p>
  <p>${post.excerpt}</p>
  <a href="/blog/${slug}.html">Läs mer →</a>
</li>
`;

    const startMarker = '<!-- BLOG_HOME_START -->';
    const endMarker = '<!-- BLOG_HOME_END -->';

    const before = existingFile.split(startMarker)[0] + startMarker;
    const middle = existingFile.split(startMarker)[1].split(endMarker)[0];
    const after = endMarker + existingFile.split(endMarker)[1];

    const existingCards = middle
      .split('<li class="blog-item">')
      .filter(function (s: string) { return s.trim().length > 0; })
      .map(function (card: string) { return '<li class="blog-item">' + card.trim(); });

    // Remove existing card with same slug to prevent duplicates
    const filteredCards = existingCards.filter(function (card: string) {
      return !card.includes('/blog/' + slug + '.html');
    });

    const updatedCards = [newCard.trim(), ...filteredCards].slice(0, 7);

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