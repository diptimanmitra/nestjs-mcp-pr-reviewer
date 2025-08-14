import { Module } from '@nestjs/common';
import { McpServerService } from './mcp-server.service';
import { PrAnalyzerService } from './pr-analyzer.service';
import { GitHubModule } from '../github/github.module';
import { NotionModule } from '../notion/notion.module';
import { McpController } from './mcp.controller';

@Module({
  imports: [GitHubModule, NotionModule],
  controllers: [McpController],
  providers: [McpServerService, PrAnalyzerService],
  exports: [McpServerService, PrAnalyzerService],
})
export class McpModule {}
