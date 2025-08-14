import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrAnalyzerService } from './pr-analyzer.service';

interface McpToolRequest {
  name: string;
  arguments: Record<string, any>;
}

interface FetchPrRequest {
  repo_owner: string;
  repo_name: string;
  pr_number: number;
}

interface CreateNotionPageRequest {
  title: string;
  content: string;
}

@Controller('mcp')
export class McpController {
  constructor(private prAnalyzerService: PrAnalyzerService) {}

  @Get('list-tools')
  listTools() {
    return {
      tools: [
        {
          name: 'fetch_pr',
          description: 'Fetch changes from a GitHub pull request',
          inputSchema: {
            type: 'object',
            properties: {
              repo_owner: { type: 'string', description: 'The owner of the GitHub repository' },
              repo_name: { type: 'string', description: 'The name of the GitHub repository' },
              pr_number: { type: 'number', description: 'The number of the pull request to analyze' },
            },
            required: ['repo_owner', 'repo_name', 'pr_number'],
          },
        },
        {
          name: 'create_notion_page',
          description: 'Create a Notion page with PR analysis',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Title for the Notion page' },
              content: { type: 'string', description: 'Content for the Notion page' },
            },
            required: ['title', 'content'],
          },
        },
      ],
    };
  }

  @Post('call-tool')
  async callTool(@Body() request: McpToolRequest) {
    const { name, arguments: args } = request;

    try {
      switch (name) {
        case 'fetch_pr':
          const fetchArgs = args as FetchPrRequest;
          const prInfo = await this.prAnalyzerService.fetchPr(
            fetchArgs.repo_owner,
            fetchArgs.repo_name,
            fetchArgs.pr_number,
          );
          return { result: prInfo };

        case 'create_notion_page':
          const createArgs = args as CreateNotionPageRequest;
          const result = await this.prAnalyzerService.createNotionPage(
            createArgs.title,
            createArgs.content,
          );
          return { result };

        default:
          throw new HttpException(`Unknown tool: ${name}`, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(
        `Error executing tool ${name}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async health() {
    const serviceStatus = await this.prAnalyzerService.validateServices();
    return {
      status: 'ok',
      services: serviceStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
