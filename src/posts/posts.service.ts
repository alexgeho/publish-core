import { Injectable } from '@nestjs/common';

/*
  Post interface defines the structure of a blog post
  stored inside our in-memory array.
*/
export interface BlogPost {
    id: number;
    title: string;
    content: string;
    publishAt: Date;
    status: 'scheduled' | 'published';
}

@Injectable()
export class PostsService {

    constructor() {
        setInterval(() => {
            this.publishDuePosts();
        }, 60000);
    }

    /*
      In-memory storage for posts.
      This replaces a real database for MVP.
    */
    private posts: BlogPost[] = [];

    /*
      Simple counter to generate unique IDs.
      In real projects, the database handles this.
    */
    private idCounter = 1;

    /*
      Create a new scheduled post.
      The post is saved with status "scheduled"
      and will be published later by the scheduler.
    */
    create(title: string, content: string, publishAt: Date) {
        const newPost: BlogPost = {
            id: this.idCounter++,
            title,
            content,
            publishAt,
            status: 'scheduled',
        };

        this.posts.push(newPost);
        return newPost;
    }

    /*
      Return all posts.
      Used for debugging and testing.
    */
    findAll() {
        return this.posts;
    }

    /*
      Check for posts that are ready to be published.
      If publish time has arrived, update status to "published".
      In real system, this is where publishing logic would run.
    */
    publishDuePosts() {
        const now = new Date();

        this.posts.forEach((post) => {
            if (
                post.status === 'scheduled' &&
                post.publishAt <= now
            ) {
                post.status = 'published';
                console.log(`Published post ${post.id}`);
            }
        });
    }
}