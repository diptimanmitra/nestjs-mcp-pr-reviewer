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
var GitHubService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let GitHubService = GitHubService_1 = class GitHubService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GitHubService_1.name);
        this.githubToken = this.configService.get('GITHUB_TOKEN');
        if (!this.githubToken) {
            throw new Error('GITHUB_TOKEN is required in environment variables');
        }
        this.httpClient = axios_1.default.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Authorization': `token ${this.githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'NestJS-MCP-PR-Reviewer/1.0.0',
            },
            timeout: 30000,
        });
    }
    async fetchPrChanges(repoOwner, repoName, prNumber) {
        this.logger.log(`Fetching PR changes for ${repoOwner}/${repoName}#${prNumber}`);
        try {
            const prResponse = await this.httpClient.get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}`);
            const prData = prResponse.data;
            const filesResponse = await this.httpClient.get(`/repos/${repoOwner}/${repoName}/pulls/${prNumber}/files`);
            const filesData = filesResponse.data;
            const changes = filesData.map((file) => ({
                filename: file.filename,
                status: file.status,
                additions: file.additions,
                deletions: file.deletions,
                changes: file.changes,
                patch: file.patch || '',
                raw_url: file.raw_url || '',
                contents_url: file.contents_url || '',
            }));
            const prInfo = {
                title: prData.title,
                description: prData.body || '',
                author: prData.user.login,
                created_at: prData.created_at,
                updated_at: prData.updated_at,
                state: prData.state,
                total_changes: changes.length,
                changes,
            };
            this.logger.log(`Successfully fetched ${changes.length} changes`);
            return prInfo;
        }
        catch (error) {
            this.logger.error(`Error fetching PR changes: ${error.message}`, error.stack);
            return null;
        }
    }
    async validateRepository(repoOwner, repoName) {
        try {
            await this.httpClient.get(`/repos/${repoOwner}/${repoName}`);
            return true;
        }
        catch (error) {
            this.logger.warn(`Repository ${repoOwner}/${repoName} not accessible: ${error.message}`);
            return false;
        }
    }
    async getPullRequestList(repoOwner, repoName, state = 'open', limit = 10) {
        try {
            const response = await this.httpClient.get(`/repos/${repoOwner}/${repoName}/pulls`, {
                params: {
                    state,
                    per_page: limit,
                    sort: 'updated',
                    direction: 'desc',
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching PR list: ${error.message}`, error.stack);
            return [];
        }
    }
};
exports.GitHubService = GitHubService;
exports.GitHubService = GitHubService = GitHubService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GitHubService);
//# sourceMappingURL=github.service.js.map