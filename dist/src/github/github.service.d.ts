import { ConfigService } from '@nestjs/config';
export interface PullRequestFile {
    filename: string;
    status: 'added' | 'modified' | 'removed';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
    raw_url?: string;
    contents_url?: string;
}
export interface PullRequestInfo {
    title: string;
    description: string;
    author: string;
    created_at: string;
    updated_at: string;
    state: string;
    total_changes: number;
    changes: PullRequestFile[];
}
export declare class GitHubService {
    private configService;
    private readonly logger;
    private readonly httpClient;
    private readonly githubToken;
    constructor(configService: ConfigService);
    fetchPrChanges(repoOwner: string, repoName: string, prNumber: number): Promise<PullRequestInfo | null>;
    validateRepository(repoOwner: string, repoName: string): Promise<boolean>;
    getPullRequestList(repoOwner: string, repoName: string, state?: 'open' | 'closed' | 'all', limit?: number): Promise<any[]>;
}
