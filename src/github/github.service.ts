import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GitHubService {
    private octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    async createOrUpdateFile(
        filePath: string,
        content: string,
        message: string,
    ) {
        const owner = process.env.GITHUB_OWNER as string;
        const repo = process.env.GITHUB_REPO as string;
        const branch = process.env.GITHUB_BRANCH as string;

        let sha: string | undefined;

        try {
            const existing = await this.octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });

            if (!Array.isArray(existing.data) && existing.data.sha) {
                sha = existing.data.sha;
            }
        } catch (e) {
            // File does not exist
        }

        await this.octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message,
            content: Buffer.from(content).toString('base64'),
            branch,
            sha,
        });
    }

    async getFileContent(filePath: string): Promise<string> {
        const owner = process.env.GITHUB_OWNER as string;
        const repo = process.env.GITHUB_REPO as string;
        const branch = process.env.GITHUB_BRANCH as string;

        const response = await this.octokit.repos.getContent({
            owner,
            repo,
            path: filePath,
            ref: branch,
        });

        if (Array.isArray(response.data)) {
            throw new Error('Path is a directory');
        }

        const file = response.data as {
            content: string;
            encoding: string;
        };

        return Buffer.from(file.content, 'base64').toString('utf-8');
    }

}