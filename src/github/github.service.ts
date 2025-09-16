// src/github/github.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Added missing import
import axios, { AxiosInstance } from 'axios';

export interface PullRequestInfo { // Added missing interface
  title: string;
  description: string;
  author: string;
  created_at: string;
  changes: PullRequestFile[];
}

export interface PullRequestFile { // Added missing interface
  filename: string;
  status: 'added' | 'modified' | 'removed';
  additions: number;
  deletions: number;
  patch?: string;
}

@Injectable()
export class GitHubService {
  private readonly githubToken: string; // Added missing property
  private readonly httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.githubToken = this.configService.get<string>('GITHUB_TOKEN');
    
    if (!this.githubToken) {
      console.error('GITHUB_TOKEN is required in environment variables');
      throw new Error('GITHUB_TOKEN is required in environment variables');
    }

    this.httpClient = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `Bearer ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'NestJS-MCP-Server/1.0.0',
      },
      timeout: 30000,
    });
  }

  async fetchPrChanges(repoOwner: string, repoName: string, prNumber: number): Promise<PullRequestInfo> {
    try {
      // Fetch PR metadata
      const prResponse = await this.httpClient.get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}`);
      
      // Fetch PR files/changes
      const filesResponse = await this.httpClient.get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}/files`);
      
      const changes: PullRequestFile[] = filesResponse.data.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch,
      }));

      return {
        title: prResponse.data.title,
        description: prResponse.data.body || '',
        author: prResponse.data.user.login,
        created_at: prResponse.data.created_at,
        changes,
      };
    } catch (error) {
      console.error(`Error fetching PR ${prNumber}:`, error.message);
      throw new Error(`Failed to fetch PR #${prNumber}: ${error.message}`);
    }
  }

  async validateRepository(owner: string, repo: string): Promise<boolean> {
    try {
      await this.httpClient.get(`/repos/${owner}/${repo}`);
      return true;
    } catch (error) {
      return false;
    }
  }
}
