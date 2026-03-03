export declare class AquinError extends Error {
    statusCode?: number;
    constructor(message: string, statusCode?: number);
}
export declare class InvalidKeyError extends AquinError {
    constructor(message: string);
}
export declare class InsufficientCreditsError extends AquinError {
    constructor(message: string);
}
export declare class RateLimitError extends AquinError {
    constructor(message: string);
}
export declare class ModelNotFoundError extends AquinError {
    constructor(message: string);
}
export declare class InferenceError extends AquinError {
    constructor(message: string, statusCode?: number);
}
