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
var PrAnalyzerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrAnalyzerService = void 0;
const common_1 = require("@nestjs/common");
const github_service_1 = require("../github/github.service");
const notion_service_1 = require("../notion/notion.service");
let PrAnalyzerService = PrAnalyzerService_1 = class PrAnalyzerService {
    constructor(githubService, notionService) {
        this.githubService = githubService;
        this.notionService = notionService;
        this.logger = new common_1.Logger(PrAnalyzerService_1.name);
    }
    async fetchPr(repoOwner, repoName, prNumber) {
        this.logger.log(`Fetching PR #${prNumber} from ${repoOwner}/${repoName}`);
        try {
            const prInfo = await this.githubService.fetchPrChanges(repoOwner, repoName, prNumber);
            if (!prInfo) {
                this.logger.warn('No changes returned from GitHub service');
                return {};
            }
            this.logger.log('Successfully fetched PR information');
            return prInfo;
        }
        catch (error) {
            this.logger.error(`Error fetching PR: ${error.message}`, error.stack);
            return {};
        }
    }
    async createNotionPage(title, content) {
        this.logger.log(`Creating Notion page: ${title}`);
        try {
            const result = await this.notionService.createPage({
                title,
                content,
            });
            this.logger.log(`Notion page '${title}' created successfully!`);
            return result;
        }
        catch (error) {
            const errorMessage = `Error creating Notion page: ${error.message}`;
            this.logger.error(errorMessage, error.stack);
            return errorMessage;
        }
    }
    async createPRAnalysisPage(prTitle, analysis, prMetadata) {
        try {
            return await this.notionService.createPRAnalysisPage(prTitle, analysis, prMetadata);
        }
        catch (error) {
            const errorMessage = `Error creating PR analysis page: ${error.message}`;
            this.logger.error(errorMessage, error.stack);
            throw new Error(errorMessage);
        }
    }
    async validateServices() {
        const [githubValid, notionValid] = await Promise.all([
            this.githubService.validateRepository('microsoft', 'vscode'),
            this.notionService.testConnection(),
        ]);
        return {
            github: githubValid,
            notion: notionValid,
        };
    }
};
exports.PrAnalyzerService = PrAnalyzerService;
exports.PrAnalyzerService = PrAnalyzerService = PrAnalyzerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [github_service_1.GitHubService,
        notion_service_1.NotionService])
], PrAnalyzerService);
//# sourceMappingURL=pr-analyzer.service.js.map