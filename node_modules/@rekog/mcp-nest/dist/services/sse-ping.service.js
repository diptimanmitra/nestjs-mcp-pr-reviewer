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
var SsePingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SsePingService = void 0;
const common_1 = require("@nestjs/common");
let SsePingService = SsePingService_1 = class SsePingService {
    constructor() {
        this.pingInterval = null;
        this.logger = new common_1.Logger(SsePingService_1.name);
        this.activeConnections = new Map();
        this.pingIntervalMs = 30000;
    }
    onModuleInit() {
        this.logger.log('Initializing SSE ping service');
    }
    onModuleDestroy() {
        this.stopPingInterval();
        this.logger.log('SSE ping service stopped');
    }
    configure(options) {
        if (options.pingIntervalMs !== undefined) {
            this.pingIntervalMs = options.pingIntervalMs;
        }
        if (options.pingEnabled !== false) {
            this.startPingInterval();
        }
        else {
            this.stopPingInterval();
        }
    }
    registerConnection(sessionId, transport, res) {
        this.activeConnections.set(sessionId, { transport, res });
        this.logger.debug(`SSE connection registered: ${sessionId}`);
    }
    removeConnection(sessionId) {
        this.activeConnections.delete(sessionId);
        this.logger.debug(`SSE connection removed: ${sessionId}`);
    }
    startPingInterval() {
        if (this.pingInterval) {
            this.stopPingInterval();
        }
        this.logger.log(`Starting SSE ping service (interval: ${this.pingIntervalMs}ms)`);
        this.pingInterval = setInterval(() => {
            this.sendPingToAllConnections();
        }, this.pingIntervalMs);
    }
    stopPingInterval() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
            this.logger.log('SSE ping interval stopped');
        }
    }
    sendPingToAllConnections() {
        const timestamp = Date.now();
        const connectionCount = this.activeConnections.size;
        if (connectionCount === 0) {
            return;
        }
        this.logger.debug(`Sending SSE ping to ${connectionCount} connections`);
        for (const [sessionId, { res }] of this.activeConnections.entries()) {
            try {
                if (!res.closed && res.writable) {
                    res.write(`: ping - ${new Date(timestamp).toISOString()}\n\n`);
                }
                else {
                    this.logger.debug(`Connection ${sessionId} is no longer writable, removing`);
                    this.removeConnection(sessionId);
                }
            }
            catch (error) {
                this.logger.error(`Error sending ping to connection ${sessionId}`, error);
                this.removeConnection(sessionId);
            }
        }
    }
};
exports.SsePingService = SsePingService;
exports.SsePingService = SsePingService = SsePingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SsePingService);
//# sourceMappingURL=sse-ping.service.js.map