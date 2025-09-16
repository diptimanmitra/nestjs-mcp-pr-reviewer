// src/mcp/pr-analyzer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GitHubService, PullRequestInfo } from '../github/github.service'; // Fixed import
import { NotionService } from '../notion/notion.service';

@Injectable()
export class PrAnalyzerService {
  private readonly logger = new Logger(PrAnalyzerService.name);

  constructor(
    private readonly githubService: GitHubService,
    private readonly notionService: NotionService,
  ) {}

  async fetchPr(repoOwner: string, repoName: string, prNumber: number): Promise<PullRequestInfo> {
    this.logger.log(`Fetching PR #${prNumber} from ${repoOwner}/${repoName}`);
    
    try {
      const prInfo = await this.githubService.fetchPrChanges(repoOwner, repoName, prNumber); // Fixed method name
      
      this.logger.log(`Successfully fetched PR: ${prInfo.title}`);
      return prInfo;
    } catch (error) {
      this.logger.error(`Failed to fetch PR: ${error.message}`);
      throw error;
    }
  }

  async createNotionPage(title: string, content: string): Promise<string> {
    this.logger.log(`Creating Notion page: ${title}`);
    
    try {
      const result = await this.notionService.createPage({
        title,
        content,
      });
      
      this.logger.log(`Successfully created Notion page`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create Notion page: ${error.message}`);
      throw error;
    }
  }

  async analyzeAndDocumentPr(
    repoOwner: string,
    repoName: string,
    prNumber: number,
  ): Promise<string> {
    try {
      // Fetch PR data
      const prInfo = await this.fetchPr(repoOwner, repoName, prNumber);
      
      // Generate analysis content
      const analysisContent = this.generatePrAnalysis(prInfo);
      
      // Create Notion page
      const pageTitle = `PR Analysis: ${prInfo.title}`;
      await this.createNotionPage(pageTitle, analysisContent);
      
      return `Successfully analyzed and documented PR #${prNumber}`;
    } catch (error) {
      this.logger.error(`Failed to analyze and document PR: ${error.message}`);
      throw error;
    }
  }

  private generatePrAnalysis(prInfo: PullRequestInfo): string {
    const filesSummary = prInfo.changes.map(change => 
      `- ${change.filename} (${change.status}): +${change.additions}/-${change.deletions}`
    ).join('\n');

    return `
# PR Analysis: ${prInfo.title}

**Author**: ${prInfo.author}
**Created**: ${new Date(prInfo.created_at).toLocaleDateString()}

## Description
${prInfo.description}

## Files Changed (${prInfo.changes.length} files)
${filesSummary}

## Summary
- Total files changed: ${prInfo.changes.length}
- Total additions: ${prInfo.changes.reduce((sum, change) => sum + change.additions, 0)}
- Total deletions: ${prInfo.changes.reduce((sum, change) => sum + change.deletions, 0)}
    `.trim();
  }

  // Test method for validation
  async validateSetup(): Promise<void> {
    this.logger.log('Validating MCP server setup...');
    
    // Test GitHub connectivity
    const isGitHubValid = await this.githubService.validateRepository('microsoft', 'vscode'); // Fixed method name
    if (!isGitHubValid) {
      throw new Error('GitHub API validation failed');
    }
    
    this.logger.log('Setup validation completed successfully');
  }
}
