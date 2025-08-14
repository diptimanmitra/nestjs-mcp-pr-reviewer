"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpModule = void 0;
const common_1 = require("@nestjs/common");
const mcp_server_service_1 = require("./mcp-server.service");
const pr_analyzer_service_1 = require("./pr-analyzer.service");
const github_module_1 = require("../github/github.module");
const notion_module_1 = require("../notion/notion.module");
const mcp_controller_1 = require("./mcp.controller");
let McpModule = class McpModule {
};
exports.McpModule = McpModule;
exports.McpModule = McpModule = __decorate([
    (0, common_1.Module)({
        imports: [github_module_1.GitHubModule, notion_module_1.NotionModule],
        controllers: [mcp_controller_1.McpController],
        providers: [mcp_server_service_1.McpServerService, pr_analyzer_service_1.PrAnalyzerService],
        exports: [mcp_server_service_1.McpServerService, pr_analyzer_service_1.PrAnalyzerService],
    })
], McpModule);
//# sourceMappingURL=mcp.module.js.map