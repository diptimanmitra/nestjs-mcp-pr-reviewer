// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Disable colored output for STDIO mode
  process.env.NO_COLOR = '1';
  
  const transportMode = process.env.MCP_TRANSPORT || 'stdio';
  
  if (transportMode === 'stdio') {
    // STDIO mode for Claude Desktop - minimal logging
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false, // Disable NestJS logger completely for STDIO
    });
    
    // Setup clean process handlers
    process.on('SIGINT', async () => {
      await app.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await app.close();
      process.exit(0);
    });

    // Keep the process alive - MCP SDK handles STDIO communication
    
  } else {
    // HTTP mode with normal logging
    const app = await NestFactory.create(AppModule); // Fixed: was NestJS.create
    const port = process.env.PORT || 3000;
    
    app.enableCors();
    await app.listen(port);
    
    const logger = new Logger('Bootstrap');
    logger.log(`🚀 MCP Server running on http://localhost:${port}`);
  }
}

bootstrap().catch((error) => {
  // Send errors to stderr, not stdout
  console.error('Bootstrap error:', error);
  process.exit(1);
});
