"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpHandlerBase = void 0;
const common_1 = require("@nestjs/common");
class McpHandlerBase {
    constructor(moduleRef, registry, loggerContext) {
        this.moduleRef = moduleRef;
        this.registry = registry;
        this.logger = new common_1.Logger(loggerContext);
    }
    createContext(mcpServer, mcpRequest) {
        if (mcpServer.server.transport.sessionId === undefined) {
            return this.createStatelessContext(mcpServer, mcpRequest);
        }
        const progressToken = mcpRequest.params?._meta?.progressToken;
        return {
            reportProgress: async (progress) => {
                if (progressToken) {
                    await mcpServer.server.notification({
                        method: 'notifications/progress',
                        params: {
                            ...progress,
                            progressToken,
                        },
                    });
                }
            },
            log: {
                debug: (message, context) => {
                    void mcpServer.server.sendLoggingMessage({
                        level: 'debug',
                        data: { message, context },
                    });
                },
                error: (message, context) => {
                    void mcpServer.server.sendLoggingMessage({
                        level: 'error',
                        data: { message, context },
                    });
                },
                info: (message, context) => {
                    void mcpServer.server.sendLoggingMessage({
                        level: 'info',
                        data: { message, context },
                    });
                },
                warn: (message, context) => {
                    void mcpServer.server.sendLoggingMessage({
                        level: 'warning',
                        data: { message, context },
                    });
                },
            },
            mcpServer,
            mcpRequest,
        };
    }
    createStatelessContext(mcpServer, mcpRequest) {
        const warn = (fn) => {
            this.logger.warn(`Stateless context: '${fn}' is not supported.`);
        };
        return {
            reportProgress: async (_progress) => {
                warn('reportProgress not supported in stateless');
            },
            log: {
                debug: (_message, _data) => {
                    warn('server report logging not supported in stateless');
                },
                error: (_message, _data) => {
                    warn('server report logging not supported in stateless');
                },
                info: (_message, _data) => {
                    warn('server report logging not supported in stateless');
                },
                warn: (_message, _data) => {
                    warn('server report logging not supported in stateless');
                },
            },
            mcpServer,
            mcpRequest,
        };
    }
}
exports.McpHandlerBase = McpHandlerBase;
//# sourceMappingURL=mcp-handler.base.js.map