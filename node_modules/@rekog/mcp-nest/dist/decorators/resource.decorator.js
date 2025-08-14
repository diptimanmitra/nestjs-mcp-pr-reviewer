"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const Resource = (options) => {
    return (0, common_1.SetMetadata)(constants_1.MCP_RESOURCE_METADATA_KEY, options);
};
exports.Resource = Resource;
//# sourceMappingURL=resource.decorator.js.map