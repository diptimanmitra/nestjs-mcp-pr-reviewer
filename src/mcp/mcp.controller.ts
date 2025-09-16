// src/mcp/mcp.controller.ts
import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PrAnalyzerService } from './pr-analyzer.service';

@Controller('mcp')
export class McpController {
  constructor(private readonly prAnalyzerService: PrAnalyzerService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nestjs-mcp-pr-reviewer',
      version: '1.0.0',
    };
  }

  @Post('list-tools')
  async listTools() {
    return {
      tools: [
        {
          name: 'fetch_pr',
          description: 'Fetch changes from a GitHub pull request',
          inputSchema: {
            type: 'object',
            properties: {
              repo_owner: { type: 'string', description: 'Repository owner' },
              repo_name: { type: 'string', description: 'Repository name' },
              pr_number: { type: 'number', description: 'PR number' },
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
              title: { type: 'string', description: 'Page title' },
              content: { type: 'string', description: 'Page content' },
            },
            required: ['title', 'content'],
          },
        },
      ],
    };
  }

  @Post('call-tool')
  async callTool(@Body() body: any) {
    const { name, arguments: args } = body;

    try {
      let result;

      switch (name) {
        case 'fetch_pr':
          result = await this.prAnalyzerService.fetchPr(
            args.repo_owner,
            args.repo_name,
            args.pr_number,
          );
          break;

        case 'create_notion_page':
          result = await this.prAnalyzerService.createNotionPage(
            args.title,
            args.content,
          );
          break;

        default:
          throw new HttpException(`Unknown tool: ${name}`, HttpStatus.BAD_REQUEST);
      }

      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new HttpException(
        {
          error: error.message,
          tool: name,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('validate')
  async validateSetup() {
    try {
      // Fixed: Use the correct method name from PrAnalyzerService
      await this.prAnalyzerService.validateSetup();
      
      return {
        status: 'valid',
        message: 'All services are properly configured',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'invalid',
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
