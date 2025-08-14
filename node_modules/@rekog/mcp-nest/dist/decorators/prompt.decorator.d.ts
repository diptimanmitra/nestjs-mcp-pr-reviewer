import { ZodType, ZodTypeDef, ZodOptional, ZodObject } from 'zod';
type PromptArgsRawShape = {
    [k: string]: ZodType<string, ZodTypeDef, string> | ZodOptional<ZodType<string, ZodTypeDef, string>>;
};
export interface PromptMetadata {
    name: string;
    description: string;
    parameters?: ZodObject<PromptArgsRawShape>;
}
export interface PromptOptions {
    name?: string;
    description: string;
    parameters?: ZodObject<PromptArgsRawShape>;
}
export declare const Prompt: (options: PromptOptions) => import("@nestjs/common").CustomDecorator<string>;
export {};
//# sourceMappingURL=prompt.decorator.d.ts.map