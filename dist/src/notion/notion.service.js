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
var NotionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@notionhq/client");
let NotionService = NotionService_1 = class NotionService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(NotionService_1.name);
        const notionApiKey = this.configService.get('NOTION_API_KEY');
        this.notionPageId = this.configService.get('NOTION_PAGE_ID');
        if (!notionApiKey || !this.notionPageId) {
            throw new Error('NOTION_API_KEY and NOTION_PAGE_ID are required in environment variables');
        }
        this.notion = new client_1.Client({
            auth: notionApiKey,
        });
        this.logger.log('Notion client initialized successfully');
        this.logger.log(`Using Notion page ID: ${this.notionPageId}`);
    }
    async createPage(pageData) {
        this.logger.log(`Creating Notion page: ${pageData.title}`);
        try {
            const response = await this.notion.pages.create({
                parent: {
                    type: 'page_id',
                    page_id: this.notionPageId,
                },
                properties: {
                    title: {
                        title: [
                            {
                                text: {
                                    content: pageData.title,
                                },
                            },
                        ],
                    },
                    ...pageData.properties,
                },
                children: [
                    {
                        object: 'block',
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [
                                {
                                    type: 'text',
                                    text: {
                                        content: pageData.content,
                                    },
                                },
                            ],
                        },
                    },
                ],
            });
            const successMessage = `Notion page '${pageData.title}' created successfully!`;
            this.logger.log(successMessage);
            return successMessage;
        }
        catch (error) {
            const errorMessage = `Error creating Notion page: ${error.message}`;
            this.logger.error(errorMessage, error.stack);
            throw new Error(errorMessage);
        }
    }
    async createPRAnalysisPage(prTitle, analysis, metadata) {
        const pageTitle = `PR Analysis: ${prTitle}`;
        const structuredContent = `
# Pull Request Analysis

## Summary
${analysis}

## Metadata
${metadata ? Object.entries(metadata)
            .map(([key, value]) => `- **${key}**: ${value}`)
            .join('\n') : 'No additional metadata provided'}

## Generated
- **Timestamp**: ${new Date().toISOString()}
- **Tool**: NestJS MCP PR Reviewer
    `;
        return this.createPage({
            title: pageTitle,
            content: structuredContent,
            properties: {
                'PR Number': {
                    number: metadata?.prNumber || null,
                },
                'Repository': {
                    rich_text: [
                        {
                            text: {
                                content: metadata?.repository || 'Unknown',
                            },
                        },
                    ],
                },
                'Author': {
                    rich_text: [
                        {
                            text: {
                                content: metadata?.author || 'Unknown',
                            },
                        },
                    ],
                },
                'Status': {
                    select: {
                        name: metadata?.status || 'Analyzed',
                    },
                },
            },
        });
    }
    async testConnection() {
        try {
            await this.notion.pages.retrieve({ page_id: this.notionPageId });
            this.logger.log('Notion connection test successful');
            return true;
        }
        catch (error) {
            this.logger.error(`Notion connection test failed: ${error.message}`);
            return false;
        }
    }
};
exports.NotionService = NotionService;
exports.NotionService = NotionService = NotionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotionService);
//# sourceMappingURL=notion.service.js.map