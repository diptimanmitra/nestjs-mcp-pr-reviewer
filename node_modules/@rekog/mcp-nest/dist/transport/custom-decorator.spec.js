"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const sse_controller_factory_1 = require("./sse.controller.factory");
const streamable_http_controller_factory_1 = require("./streamable-http.controller.factory");
describe('Custom Decorators', () => {
    const testCustomDecorator = (0, common_1.SetMetadata)('test:decorator', true);
    describe('SSE Controller Factory', () => {
        it('should apply custom decorators to the SSE controller', () => {
            const decorators = [testCustomDecorator];
            const sseController = (0, sse_controller_factory_1.createSseController)('test-sse-endpoint', 'test-messages-endpoint', '/api', [], decorators);
            expect(sseController).toBeDefined();
            expect(Reflect.getMetadata('test:decorator', sseController)).toBeTruthy();
        });
        it('should work without custom decorators', () => {
            const sseController = (0, sse_controller_factory_1.createSseController)('test-sse-endpoint', 'test-messages-endpoint', '/api');
            expect(sseController).toBeDefined();
            expect(Reflect.getMetadata('test:decorator', sseController)).toBeUndefined();
        });
    });
    describe('Streamable HTTP Controller Factory', () => {
        it('should apply custom decorators to the Streamable HTTP controller', () => {
            const decorators = [testCustomDecorator];
            const streamableController = (0, streamable_http_controller_factory_1.createStreamableHttpController)('test-http-endpoint', '/api', [], decorators);
            expect(streamableController).toBeDefined();
            expect(Reflect.getMetadata('test:decorator', streamableController)).toBeTruthy();
        });
        it('should work without custom decorators', () => {
            const StreamableController = (0, streamable_http_controller_factory_1.createStreamableHttpController)('test-http-endpoint', '/api');
            expect(StreamableController).toBeDefined();
        });
    });
});
//# sourceMappingURL=custom-decorator.spec.js.map