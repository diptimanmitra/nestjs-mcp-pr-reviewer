import { OnApplicationBootstrap } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { McpOptions } from '../interfaces';
import { McpRegistryService } from '../services/mcp-registry.service';
export declare class StdioService implements OnApplicationBootstrap {
    private readonly options;
    private readonly mcpModuleId;
    private readonly moduleRef;
    private readonly toolRegistry;
    private readonly logger;
    constructor(options: McpOptions, mcpModuleId: string, moduleRef: ModuleRef, toolRegistry: McpRegistryService);
    onApplicationBootstrap(): Promise<void>;
}
//# sourceMappingURL=stdio.service.d.ts.map