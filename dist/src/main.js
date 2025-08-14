"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const mcp_server_service_1 = require("./mcp/mcp-server.service");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        const mcpServerService = app.get(mcp_server_service_1.McpServerService);
        const transportMode = process.env.MCP_TRANSPORT || 'stdio';
        if (transportMode === 'stdio') {
            logger.log('Starting MCP Server in STDIO mode for Claude Desktop...');
            await mcpServerService.startStdioServer();
        }
        else {
            const port = configService.get('PORT', 3000);
            app.enableCors({
                origin: true,
                credentials: true,
            });
            await app.listen(port);
            logger.log(`🚀 MCP Server running on: http://localhost:${port}`);
            logger.log(`📊 Health check: http://localhost:${port}/health`);
        }
    }
    catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map