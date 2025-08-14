import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { McpServerService } from './mcp/mcp-server.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const mcpServerService = app.get(McpServerService);
    
    // Get transport mode from environment
    const transportMode = process.env.MCP_TRANSPORT || 'stdio';
    
    if (transportMode === 'stdio') {
      // STDIO mode for Claude Desktop integration
      logger.log('Starting MCP Server in STDIO mode for Claude Desktop...');
      await mcpServerService.startStdioServer();
    } else {
      // HTTP mode for web-based integrations
      const port = configService.get<number>('PORT', 3000);
      
      // Enable CORS for web integrations
      app.enableCors({
        origin: true,
        credentials: true,
      });
      
      await app.listen(port);
      logger.log(`🚀 MCP Server running on: http://localhost:${port}`);
      logger.log(`📊 Health check: http://localhost:${port}/health`);
    }
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
