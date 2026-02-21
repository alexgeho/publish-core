import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/publish-core'),
    PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
