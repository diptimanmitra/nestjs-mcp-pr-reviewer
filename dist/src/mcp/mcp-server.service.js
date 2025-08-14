"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var McpServerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpServerService = void 0;
const common_1 = require("@nestjs/common");
const pr_analyzer_service_1 = require("./pr-analyzer.service");
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
let McpServerService = McpServerService_1 = class McpServerService {
    constructor(prAnalyzerService) {
        this.prAnalyzerService = prAnalyzerService;
        this.logger = new common_1.Logger(McpServerService_1.name);
        this.initializeServer();
    }
    initializeServer() {
        this.server = new index_js_1.Server({
            name: 'github-pr-analysis',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.registerTools();
        this.setupErrorHandling();
    }
    registerTools() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'fetch_pr',
                        description: 'Fetch changes from a GitHub pull request',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                repo_owner: {
                                    type: 'string',
                                    description: 'The owner of the GitHub repository',
                                },
                                repo_name: {
                                    type: 'string',
                                    description: 'The name of the GitHub repository',
                                },
                                pr_number: {
                                    type: 'number',
                                    description: 'The number of the pull request to analyze',
                                },
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
                                title: {
                                    type: 'string',
                                    description: 'Title for the Notion page',
                                },
                                content: {
                                    type: 'string',
                                    description: 'Content for the Notion page',
                                },
                            },
                            required: ['title', 'content'],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'fetch_pr':
                        const fetchPrSchema = zod_1.z.object({
                            repo_owner: zod_1.z.string(),
                            repo_name: zod_1.z.string(),
                            pr_number: zod_1.z.number(),
                        });
                        const fetchPrArgs = fetchPrSchema.parse(args);
                        const prInfo = await this.prAnalyzerService.fetchPr(fetchPrArgs.repo_owner, fetchPrArgs.repo_name, fetchPrArgs.pr_number);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: JSON.stringify(prInfo, null, 2),
                                },
                            ],
                        };
                    case 'create_notion_page':
                        const createPageSchema = zod_1.z.object({
                            title: zod_1.z.string(),
                            content: zod_1.z.string(),
                        });
                        const createPageArgs = createPageSchema.parse(args);
                        const result = await this.prAnalyzerService.createNotionPage(createPageArgs.title, createPageArgs.content);
                        return {
                            content: [
                                {
                                    type: 'text',
                                    text: result,
                                },
                            ],
                        };
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                this.logger.error(`Error executing tool ${name}:`, error);
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
    setupErrorHandling() {
        this.server.onerror = error => {
            this.logger.error('MCP Server error:', error);
        };
        process.on('SIGINT', async () => {
            this.logger.log('Shutting down MCP server...');
            await this.server.close();
            process.exit(0);
        });
    }
    async startStdioServer() {
        const transport = new stdio_js_1.StdioServerTransport();
        this.logger.log('Starting MCP Server with STDIO transport...');
        await this.server.connect(transport);
        this.logger.log('MCP Server connected and ready for Claude Desktop');
    }
    getServer() {
        return this.server;
    }
};
exports.McpServerService = McpServerService;
exports.McpServerService = McpServerService = McpServerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pr_analyzer_service_1.PrAnalyzerService])
], McpServerService);
//# sourceMappingURL=mcp-server.service.js.map