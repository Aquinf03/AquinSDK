import {
  AquinError,
  InvalidKeyError,
  InsufficientCreditsError,
  RateLimitError,
  ModelNotFoundError,
  InferenceError,
} from "./exceptions";

const DEFAULT_BASE_URL = "https://www.aquin.app";

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

export class AquinClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = DEFAULT_BASE_URL) {
    if (!apiKey) throw new Error("apiKey is required");
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async complete(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResponse> {
    const { max_tokens = 512, temperature = 0.7, system_prompt } = options;

    const messages: { role: string; content: string }[] = [];
    if (system_prompt) messages.push({ role: "system", content: system_prompt });
    messages.push({ role: "user", content: prompt });

    const body: Record<string, unknown> = { prompt, messages, max_tokens, temperature };

    let res: Response;
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
    } catch (err) {
      throw new InferenceError(`Network error: ${(err as Error).message}`);
    }

    return this.handleResponse(res);
  }

  private async handleResponse(res: Response): Promise<CompletionResponse> {
    if (res.ok) {
      const data = await res.json() as any;
      return {
        text: data.text,
        tokens_in: data.tokens_in,
        tokens_out: data.tokens_out,
      };
    }

    let errorMsg = `HTTP ${res.status}`;
    try {
      const body = await res.json() as any;
      errorMsg = body.error ?? errorMsg;
    } catch {
      // empty body
    }

    switch (res.status) {
      case 401: throw new InvalidKeyError(errorMsg);
      case 402: throw new InsufficientCreditsError(errorMsg);
      case 404: throw new ModelNotFoundError(errorMsg);
      case 429: throw new RateLimitError(errorMsg);
      case 502:
      case 503: throw new InferenceError(errorMsg, res.status);
      default:  throw new AquinError(errorMsg, res.status);
    }
  }
}