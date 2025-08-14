"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const Prompt = (options) => {
    return (0, common_1.SetMetadata)(constants_1.MCP_PROMPT_METADATA_KEY, options);
};
exports.Prompt = Prompt;
//# sourceMappingURL=prompt.decorator.js.map