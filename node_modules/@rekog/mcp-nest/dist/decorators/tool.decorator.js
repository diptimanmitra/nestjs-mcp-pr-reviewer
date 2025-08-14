"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tool = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const zod_1 = require("zod");
const Tool = (options) => {
    if (options.parameters === undefined) {
        options.parameters = zod_1.z.object({});
    }
    return (0, common_1.SetMetadata)(constants_1.MCP_TOOL_METADATA_KEY, options);
};
exports.Tool = Tool;
//# sourceMappingURL=tool.decorator.js.map