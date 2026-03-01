"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InferenceError = exports.ModelNotFoundError = exports.RateLimitError = exports.InsufficientCreditsError = exports.InvalidKeyError = exports.AquinError = void 0;
class AquinError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "AquinError";
        this.statusCode = statusCode;
    }
}
exports.AquinError = AquinError;
class InvalidKeyError extends AquinError {
    constructor(message) {
        super(message, 401);
        this.name = "InvalidKeyError";
    }
}
exports.InvalidKeyError = InvalidKeyError;
class InsufficientCreditsError extends AquinError {
    constructor(message) {
        super(message, 402);
        this.name = "InsufficientCreditsError";
    }
}
exports.InsufficientCreditsError = InsufficientCreditsError;
class RateLimitError extends AquinError {
    constructor(message) {
        super(message, 429);
        this.name = "RateLimitError";
    }
}
exports.RateLimitError = RateLimitError;
class ModelNotFoundError extends AquinError {
    constructor(message) {
        super(message, 404);
        this.name = "ModelNotFoundError";
    }
}
exports.ModelNotFoundError = ModelNotFoundError;
class InferenceError extends AquinError {
    constructor(message, statusCode) {
        super(message, statusCode);
        this.name = "InferenceError";
    }
}
exports.InferenceError = InferenceError;
