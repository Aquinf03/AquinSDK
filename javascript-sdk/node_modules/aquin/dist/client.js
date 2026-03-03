"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AquinClient = void 0;
const exceptions_1 = require("./exceptions");
const DEFAULT_BASE_URL = "https://www.aquin.app";
class AquinClient {
    constructor(apiKey, baseUrl = DEFAULT_BASE_URL) {
        if (!apiKey)
            throw new Error("apiKey is required");
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/$/, "");
    }
    async complete(prompt, options = {}) {
        const { max_tokens = 512, temperature = 0.7, system_prompt } = options;
        const messages = [];
        if (system_prompt)
            messages.push({ role: "system", content: system_prompt });
        messages.push({ role: "user", content: prompt });
        const body = { prompt, messages, max_tokens, temperature };
        let res;
        try {
            res = await fetch(`${this.baseUrl}/api/v1/model`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                redirect: "follow",
            });
        }
        catch (err) {
            throw new exceptions_1.InferenceError(`Network error: ${err.message}`);
        }
        return this.handleResponse(res);
    }
    async handleResponse(res) {
        if (res.ok) {
            const data = await res.json();
            return {
                text: data.text,
                tokens_in: data.tokens_in,
                tokens_out: data.tokens_out,
            };
        }
        let errorMsg = `HTTP ${res.status}`;
        try {
            const body = await res.json();
            errorMsg = body.error ?? errorMsg;
        }
        catch {
            // empty body
        }
        switch (res.status) {
            case 401: throw new exceptions_1.InvalidKeyError(errorMsg);
            case 402: throw new exceptions_1.InsufficientCreditsError(errorMsg);
            case 404: throw new exceptions_1.ModelNotFoundError(errorMsg);
            case 429: throw new exceptions_1.RateLimitError(errorMsg);
            case 502:
            case 503: throw new exceptions_1.InferenceError(errorMsg, res.status);
            default: throw new exceptions_1.AquinError(errorMsg, res.status);
        }
    }
}
exports.AquinClient = AquinClient;
