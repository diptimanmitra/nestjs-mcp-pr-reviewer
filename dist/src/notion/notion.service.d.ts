import { ConfigService } from '@nestjs/config';
export interface NotionPageContent {
    title: string;
    content: string;
    properties?: Record<string, any>;
}
export declare class NotionService {
    private configService;
    private readonly logger;
    private readonly notion;
    private readonly notionPageId;
    constructor(configService: ConfigService);
    createPage(pageData: NotionPageContent): Promise<string>;
    createPRAnalysisPage(prTitle: string, analysis: string, metadata?: Record<string, any>): Promise<string>;
    testConnection(): Promise<boolean>;
}
