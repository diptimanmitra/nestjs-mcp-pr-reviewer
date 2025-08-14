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
var McpExecutorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpExecutorService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mcp_registry_service_1 = require("./mcp-registry.service");
const mcp_tools_handler_1 = require("./handlers/mcp-tools.handler");
const mcp_resources_handler_1 = require("./handlers/mcp-resources.handler");
const mcp_prompts_handler_1 = require("./handlers/mcp-prompts.handler");
let McpExecutorService = McpExecutorService_1 = class McpExecutorService {
    constructor(moduleRef, registry, mcpModuleId) {
        this.logger = new common_1.Logger(McpExecutorService_1.name);
        this.toolsHandler = new mcp_tools_handler_1.McpToolsHandler(moduleRef, registry, mcpModuleId);
        this.resourcesHandler = new mcp_resources_handler_1.McpResourcesHandler(moduleRef, registry, mcpModuleId);
        this.promptsHandler = new mcp_prompts_handler_1.McpPromptsHandler(moduleRef, registry, mcpModuleId);
    }
    registerRequestHandlers(mcpServer, httpRequest) {
        this.toolsHandler.registerHandlers(mcpServer, httpRequest);
        this.resourcesHandler.registerHandlers(mcpServer, httpRequest);
        this.promptsHandler.registerHandlers(mcpServer, httpRequest);
    }
};
exports.McpExecutorService = McpExecutorService;
exports.McpExecutorService = McpExecutorService = McpExecutorService_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(2, (0, common_1.Inject)('MCP_MODULE_ID')),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        mcp_registry_service_1.McpRegistryService, String])
], McpExecutorService);
//# sourceMappingURL=mcp-executor.service.js.map