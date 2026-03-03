export interface CompletionResponse {
    text: string;
    tokens_in: number;
    tokens_out: number;
}
export interface CompletionOptions {
    max_tokens?: number;
    temperature?: number;
    system_prompt?: string;
}
export declare class AquinClient {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string, baseUrl?: string);
    complete(prompt: string, options?: CompletionOptions): Promise<CompletionResponse>;
    private handleResponse;
}
