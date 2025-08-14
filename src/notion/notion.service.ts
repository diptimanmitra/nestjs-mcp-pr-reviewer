import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';

export interface NotionPageContent {
  title: string;
  content: string;
  properties?: Record<string, any>;
}

@Injectable()
export class NotionService {
  private readonly logger = new Logger(NotionService.name);
  private readonly notion: Client;
  private readonly notionPageId: string;

  constructor(private configService: ConfigService) {
    const notionApiKey = this.configService.get<string>('NOTION_API_KEY');
    this.notionPageId = this.configService.get<string>('NOTION_PAGE_ID');

    if (!notionApiKey || !this.notionPageId) {
      throw new Error('NOTION_API_KEY and NOTION_PAGE_ID are required in environment variables');
    }

    this.notion = new Client({
      auth: notionApiKey,
    });

    this.logger.log('Notion client initialized successfully');
    this.logger.log(`Using Notion page ID: ${this.notionPageId}`);
  }

  async createPage(pageData: NotionPageContent): Promise<string> {
    this.logger.log(`Creating Notion page: ${pageData.title}`);

    try {
      const response = await this.notion.pages.create({
        parent: {
          type: 'page_id',
          page_id: this.notionPageId,
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: pageData.title,
                },
              },
            ],
          },
          ...pageData.properties,
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: pageData.content,
                  },
                },
              ],
            },
          },
        ],
      });

      const successMessage = `Notion page '${pageData.title}' created successfully!`;
      this.logger.log(successMessage);
      return successMessage;
    } catch (error) {
      const errorMessage = `Error creating Notion page: ${error.message}`;
      this.logger.error(errorMessage, error.stack);
      throw new Error(errorMessage);
    }
  }

  async createPRAnalysisPage(
    prTitle: string,
    analysis: string,
    metadata?: Record<string, any>,
  ): Promise<string> {
    const pageTitle = `PR Analysis: ${prTitle}`;
    
    // Enhanced content with structured format
    const structuredContent = `
# Pull Request Analysis

## Summary
${analysis}

## Metadata
${metadata ? Object.entries(metadata)
  .map(([key, value]) => `- **${key}**: ${value}`)
  .join('\n') : 'No additional metadata provided'}

## Generated
- **Timestamp**: ${new Date().toISOString()}
- **Tool**: NestJS MCP PR Reviewer
    `;

    return this.createPage({
      title: pageTitle,
      content: structuredContent,
      properties: {
        'PR Number': {
          number: metadata?.prNumber || null,
        },
        'Repository': {
          rich_text: [
            {
              text: {
                content: metadata?.repository || 'Unknown',
              },
            },
          ],
        },
        'Author': {
          rich_text: [
            {
              text: {
                content: metadata?.author || 'Unknown',
              },
            },
          ],
        },
        'Status': {
          select: {
            name: metadata?.status || 'Analyzed',
          },
        },
      },
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.notion.pages.retrieve({ page_id: this.notionPageId });
      this.logger.log('Notion connection test successful');
      return true;
    } catch (error) {
      this.logger.error(`Notion connection test failed: ${error.message}`);
      return false;
    }
  }
}
