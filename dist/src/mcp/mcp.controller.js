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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpController = void 0;
const common_1 = require("@nestjs/common");
const pr_analyzer_service_1 = require("./pr-analyzer.service");
let McpController = class McpController {
    constructor(prAnalyzerService) {
        this.prAnalyzerService = prAnalyzerService;
    }
    listTools() {
        return {
            tools: [
                {
                    name: 'fetch_pr',
                    description: 'Fetch changes from a GitHub pull request',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            repo_owner: { type: 'string', description: 'The owner of the GitHub repository' },
                            repo_name: { type: 'string', description: 'The name of the GitHub repository' },
                            pr_number: { type: 'number', description: 'The number of the pull request to analyze' },
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
                            title: { type: 'string', description: 'Title for the Notion page' },
                            content: { type: 'string', description: 'Content for the Notion page' },
                        },
                        required: ['title', 'content'],
                    },
                },
            ],
        };
    }
    async callTool(request) {
        const { name, arguments: args } = request;
        try {
            switch (name) {
                case 'fetch_pr':
                    const fetchArgs = args;
                    const prInfo = await this.prAnalyzerService.fetchPr(fetchArgs.repo_owner, fetchArgs.repo_name, fetchArgs.pr_number);
                    return { result: prInfo };
                case 'create_notion_page':
                    const createArgs = args;
                    const result = await this.prAnalyzerService.createNotionPage(createArgs.title, createArgs.content);
                    return { result };
                default:
                    throw new common_1.HttpException(`Unknown tool: ${name}`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException(`Error executing tool ${name}: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async health() {
        const serviceStatus = await this.prAnalyzerService.validateServices();
        return {
            status: 'ok',
            services: serviceStatus,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.McpController = McpController;
__decorate([
    (0, common_1.Get)('list-tools'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], McpController.prototype, "listTools", null);
__decorate([
    (0, common_1.Post)('call-tool'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], McpController.prototype, "callTool", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], McpController.prototype, "health", null);
exports.McpController = McpController = __decorate([
    (0, common_1.Controller)('mcp'),
    __metadata("design:paramtypes", [pr_analyzer_service_1.PrAnalyzerService])
], McpController);
//# sourceMappingURL=mcp.controller.js.map