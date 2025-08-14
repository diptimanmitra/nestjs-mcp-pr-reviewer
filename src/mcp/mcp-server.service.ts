// src/mcp/mcp-server.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { PrAnalyzerService } from './pr-analyzer.service';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

@Injectable()
export class McpServerService {
  private readonly logger = new Logger(McpServerService.name);
  private server: Server;

  constructor(private prAnalyzerService: PrAnalyzerService) {
    this.initializeServer();
  }

  private initializeServer() {
    this.server = new Server(
      {
        name: 'github-pr-analysis',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.registerTools();
    this.setupErrorHandling();
  }

  private registerTools() {
    // Register tools for MCP
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'fetch_pr',
            description: 'Fetch changes from a GitHub pull request',
            inputSchema: {
              type: 'object',
              properties: {
                repo_owner: {
                  type: 'string',
                  description: 'The owner of the GitHub repository',
                },
                repo_name: {
                  type: 'string',
                  description: 'The name of the GitHub repository',
                },
                pr_number: {
                  type: 'number',
                  description: 'The number of the pull request to analyze',
                },
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
                title: {
                  type: 'string',
                  description: 'Title for the Notion page',
                },
                content: {
                  type: 'string',
                  description: 'Content for the Notion page',
                },
              },
              required: ['title', 'content'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'fetch_pr':
            const fetchPrSchema = z.object({
              repo_owner: z.string(),
              repo_name: z.string(),
              pr_number: z.number(),
            });
            const fetchPrArgs = fetchPrSchema.parse(args);
            const prInfo = await this.prAnalyzerService.fetchPr(
              fetchPrArgs.repo_owner,
              fetchPrArgs.repo_name,
              fetchPrArgs.pr_number,
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(prInfo, null, 2),
                },
              ],
            };

          case 'create_notion_page':
            const createPageSchema = z.object({
              title: z.string(),
              content: z.string(),
            });
            const createPageArgs = createPageSchema.parse(args);
            const result = await this.prAnalyzerService.createNotionPage(
              createPageArgs.title,
              createPageArgs.content,
            );
            return {
              content: [
                {
                  type: 'text',
                  text: result,
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        this.logger.error(`Error executing tool ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = error => {
      this.logger.error('MCP Server error:', error);
    };

    process.on('SIGINT', async () => {
      this.logger.log('Shutting down MCP server...');
      await this.server.close();
      process.exit(0);
    });
  }

  async startStdioServer() {
    const transport = new StdioServerTransport();
    this.logger.log('Starting MCP Server with STDIO transport...');
    await this.server.connect(transport);
    this.logger.log('MCP Server connected and ready for Claude Desktop');
  }

  getServer(): Server {
    return this.server;
  }
}
