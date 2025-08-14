import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface PullRequestFile {
  filename: string;
  status: 'added' | 'modified' | 'removed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  raw_url?: string;
  contents_url?: string;
}

export interface PullRequestInfo {
  title: string;
  description: string;
  author: string;
  created_at: string;
  updated_at: string;
  state: string;
  total_changes: number;
  changes: PullRequestFile[];
}

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private readonly httpClient: AxiosInstance;
  private readonly githubToken: string;

  constructor(private configService: ConfigService) {
    this.githubToken = this.configService.get<string>('GITHUB_TOKEN');
    
    if (!this.githubToken) {
      throw new Error('GITHUB_TOKEN is required in environment variables');
    }

    this.httpClient = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'NestJS-MCP-PR-Reviewer/1.0.0',
      },
      timeout: 30000,
    });
  }

  async fetchPrChanges(
    repoOwner: string,
    repoName: string,
    prNumber: number,
  ): Promise<PullRequestInfo | null> {
    this.logger.log(`Fetching PR changes for ${repoOwner}/${repoName}#${prNumber}`);

    try {
      // Fetch PR metadata
      const prResponse = await this.httpClient.get(
        `/repos/${repoOwner}/${repoName}/pulls/${prNumber}`,
      );
      const prData = prResponse.data;

      // Fetch file changes
      const filesResponse = await this.httpClient.get(
        `/repos/${repoOwner}/${repoName}/pulls/${prNumber}/files`,
      );
      const filesData = filesResponse.data;

      // Transform file changes
      const changes: PullRequestFile[] = filesData.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch || '',
        raw_url: file.raw_url || '',
        contents_url: file.contents_url || '',
      }));

      // Combine PR metadata with file changes
      const prInfo: PullRequestInfo = {
        title: prData.title,
        description: prData.body || '',
        author: prData.user.login,
        created_at: prData.created_at,
        updated_at: prData.updated_at,
        state: prData.state,
        total_changes: changes.length,
        changes,
      };

      this.logger.log(`Successfully fetched ${changes.length} changes`);
      return prInfo;
    } catch (error) {
      this.logger.error(`Error fetching PR changes: ${error.message}`, error.stack);
      return null;
    }
  }

  async validateRepository(repoOwner: string, repoName: string): Promise<boolean> {
    try {
      await this.httpClient.get(`/repos/${repoOwner}/${repoName}`);
      return true;
    } catch (error) {
      this.logger.warn(`Repository ${repoOwner}/${repoName} not accessible: ${error.message}`);
      return false;
    }
  }

  async getPullRequestList(
    repoOwner: string,
    repoName: string,
    state: 'open' | 'closed' | 'all' = 'open',
    limit: number = 10,
  ): Promise<any[]> {
    try {
      const response = await this.httpClient.get(
        `/repos/${repoOwner}/${repoName}/pulls`,
        {
          params: {
            state,
            per_page: limit,
            sort: 'updated',
            direction: 'desc',
          },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching PR list: ${error.message}`, error.stack);
      return [];
    }
  }
}
