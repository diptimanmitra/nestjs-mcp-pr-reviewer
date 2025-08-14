import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Context, McpRequest } from '../../interfaces';
import { McpRegistryService } from '../mcp-registry.service';
export declare abstract class McpHandlerBase {
    protected readonly moduleRef: ModuleRef;
    protected readonly registry: McpRegistryService;
    protected logger: Logger;
    constructor(moduleRef: ModuleRef, registry: McpRegistryService, loggerContext: string);
    protected createContext(mcpServer: McpServer, mcpRequest: McpRequest): Context;
    protected createStatelessContext(mcpServer: McpServer, mcpRequest: McpRequest): Context;
}
//# sourceMappingURL=mcp-handler.base.d.ts.map