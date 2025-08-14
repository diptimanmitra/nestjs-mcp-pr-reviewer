import { PrAnalyzerService } from './pr-analyzer.service';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
export declare class McpServerService {
    private prAnalyzerService;
    private readonly logger;
    private server;
    constructor(prAnalyzerService: PrAnalyzerService);
    private initializeServer;
    private registerTools;
    private setupErrorHandling;
    startStdioServer(): Promise<void>;
    getServer(): Server;
}
