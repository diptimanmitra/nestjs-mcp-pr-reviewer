import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'NestJS MCP Server for GitHub PR Review is running!';
  }

  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nestjs-mcp-pr-reviewer',
      version: '1.0.0',
    };
  }
}
