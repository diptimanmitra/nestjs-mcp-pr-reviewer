import { GitHubService, PullRequestInfo } from '../github/github.service';
import { NotionService } from '../notion/notion.service';
export declare class PrAnalyzerService {
    private githubService;
    private notionService;
    private readonly logger;
    constructor(githubService: GitHubService, notionService: NotionService);
    fetchPr(repoOwner: string, repoName: string, prNumber: number): Promise<PullRequestInfo | Record<string, never>>;
    createNotionPage(title: string, content: string): Promise<string>;
    createPRAnalysisPage(prTitle: string, analysis: string, prMetadata?: {
        prNumber?: number;
        repository?: string;
        author?: string;
        status?: string;
    }): Promise<string>;
    validateServices(): Promise<{
        github: boolean;
        notion: boolean;
    }>;
}
