import { PrAnalyzerService } from './pr-analyzer.service';
interface McpToolRequest {
    name: string;
    arguments: Record<string, any>;
}
export declare class McpController {
    private prAnalyzerService;
    constructor(prAnalyzerService: PrAnalyzerService);
    listTools(): {
        tools: ({
            name: string;
            description: string;
            inputSchema: {
                type: string;
                properties: {
                    repo_owner: {
                        type: string;
                        description: string;
                    };
                    repo_name: {
                        type: string;
                        description: string;
                    };
                    pr_number: {
                        type: string;
                        description: string;
                    };
                    title?: undefined;
                    content?: undefined;
                };
                required: string[];
            };
        } | {
            name: string;
            description: string;
            inputSchema: {
                type: string;
                properties: {
                    title: {
                        type: string;
                        description: string;
                    };
                    content: {
                        type: string;
                        description: string;
                    };
                    repo_owner?: undefined;
                    repo_name?: undefined;
                    pr_number?: undefined;
                };
                required: string[];
            };
        })[];
    };
    callTool(request: McpToolRequest): Promise<{
        result: import("../github/github.service").PullRequestInfo | Record<string, never>;
    } | {
        result: string;
    }>;
    health(): Promise<{
        status: string;
        services: {
            github: boolean;
            notion: boolean;
        };
        timestamp: string;
    }>;
}
export {};
