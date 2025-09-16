// src/mcp/mcp-server.service.ts
import { Injectable } from '@nestjs/common';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { PrAnalyzerService } from './pr-analyzer.service';

@Injectable()
export class McpServerService {
  private server: Server;

  constructor(private prAnalyzerService: PrAnalyzerService) {
    this.initializeServer();
    this.startStdioServer();
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
          prompts: {},
          resources: {},
        },
      }
    );

    this.registerHandlers();
  }

  private registerHandlers() {
    // List tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
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
    });

    // List prompts (required by Claude Desktop)
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return { prompts: [] };
    });

    // List resources (required by Claude Desktop)  
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return { resources: [] };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result;
        
        switch (name) {
          case 'fetch_pr':
            result = await this.prAnalyzerService.fetchPr(
              String(args.repo_owner), // Fixed: Added type conversion
              String(args.repo_name),   // Fixed: Added type conversion
              Number(args.pr_number)    // Fixed: Added type conversion
            );
            break;
            
          case 'create_notion_page':
            result = await this.prAnalyzerService.createNotionPage(
              String(args.title),   // Fixed: Added type conversion
              String(args.content)  // Fixed: Added type conversion
            );
            break;
            
          default:
            throw new Error(`Unknown tool: ${name}`);
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

  private async startStdioServer() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
