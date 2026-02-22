import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generate(body: any) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Write an article in ${body.language} about: ${body.title}`
        }
      ],
    });

    return {
      content: response.choices[0].message.content,
    };
  }
}