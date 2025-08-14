import { Injectable, Logger } from '@nestjs/common';
import { GitHubService, PullRequestInfo } from '../github/github.service';
import { NotionService } from '../notion/notion.service';

@Injectable()
export class PrAnalyzerService {
  private readonly logger = new Logger(PrAnalyzerService.name);

  constructor(
    private githubService: GitHubService,
    private notionService: NotionService,
  ) {}

  async fetchPr(
    repoOwner: string,
    repoName: string,
    prNumber: number,
  ): Promise<PullRequestInfo | Record<string, never>> {
    this.logger.log(`Fetching PR #${prNumber} from ${repoOwner}/${repoName}`);

    try {
      const prInfo = await this.githubService.fetchPrChanges(repoOwner, repoName, prNumber);
      
      if (!prInfo) {
        this.logger.warn('No changes returned from GitHub service');
        return {};
      }

      this.logger.log('Successfully fetched PR information');
      return prInfo;
    } catch (error) {
      this.logger.error(`Error fetching PR: ${error.message}`, error.stack);
      return {};
    }
  }

  async createNotionPage(title: string, content: string): Promise<string> {
    this.logger.log(`Creating Notion page: ${title}`);

    try {
      const result = await this.notionService.createPage({
        title,
        content,
      });
      
      this.logger.log(`Notion page '${title}' created successfully!`);
      return result;
    } catch (error) {
      const errorMessage = `Error creating Notion page: ${error.message}`;
      this.logger.error(errorMessage, error.stack);
      return errorMessage;
    }
  }

  async createPRAnalysisPage(
    prTitle: string,
    analysis: string,
    prMetadata?: {
      prNumber?: number;
      repository?: string;
      author?: string;
      status?: string;
    },
  ): Promise<string> {
    try {
      return await this.notionService.createPRAnalysisPage(prTitle, analysis, prMetadata);
    } catch (error) {
      const errorMessage = `Error creating PR analysis page: ${error.message}`;
      this.logger.error(errorMessage, error.stack);
      throw new Error(errorMessage);
    }
  }

  async validateServices(): Promise<{ github: boolean; notion: boolean }> {
    const [githubValid, notionValid] = await Promise.all([
      this.githubService.validateRepository('microsoft', 'vscode'), // Test with a known public repo
      this.notionService.testConnection(),
    ]);

    return {
      github: githubValid,
      notion: notionValid,
    };
  }
}
