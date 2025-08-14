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
var StdioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdioService = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const interfaces_1 = require("../interfaces");
const mcp_executor_service_1 = require("../services/mcp-executor.service");
const mcp_registry_service_1 = require("../services/mcp-registry.service");
const capabilities_builder_1 = require("../utils/capabilities-builder");
let StdioService = StdioService_1 = class StdioService {
    constructor(options, mcpModuleId, moduleRef, toolRegistry) {
        this.options = options;
        this.mcpModuleId = mcpModuleId;
        this.moduleRef = moduleRef;
        this.toolRegistry = toolRegistry;
        this.logger = new common_1.Logger(StdioService_1.name);
    }
    async onApplicationBootstrap() {
        if (this.options.transport !== interfaces_1.McpTransportType.STDIO) {
            return;
        }
        this.logger.log('Bootstrapping MCP STDIO...');
        const capabilities = (0, capabilities_builder_1.buildMcpCapabilities)(this.mcpModuleId, this.toolRegistry, this.options);
        this.logger.debug('Built MCP capabilities:', capabilities);
        const mcpServer = new mcp_js_1.McpServer({ name: this.options.name, version: this.options.version }, {
            capabilities,
            instructions: this.options.instructions || '',
        });
        const contextId = core_1.ContextIdFactory.create();
        const executor = await this.moduleRef.resolve(mcp_executor_service_1.McpExecutorService, contextId, { strict: false });
        executor.registerRequestHandlers(mcpServer, {});
        const transport = new stdio_js_1.StdioServerTransport();
        await mcpServer.connect(transport);
        this.logger.log('MCP STDIO ready');
    }
};
exports.StdioService = StdioService;
exports.StdioService = StdioService = StdioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('MCP_OPTIONS')),
    __param(1, (0, common_1.Inject)('MCP_MODULE_ID')),
    __metadata("design:paramtypes", [Object, String, core_1.ModuleRef,
        mcp_registry_service_1.McpRegistryService])
], StdioService);
//# sourceMappingURL=stdio.service.js.map