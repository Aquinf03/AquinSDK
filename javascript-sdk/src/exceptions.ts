export class AquinError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "AquinError";
    this.statusCode = statusCode;
  }
}

export class InvalidKeyError extends AquinError {
  constructor(message: string) {
    super(message, 401);
    this.name = "InvalidKeyError";
  }
}

export class InsufficientCreditsError extends AquinError {
  constructor(message: string) {
    super(message, 402);
    this.name = "InsufficientCreditsError";
  }
}

export class RateLimitError extends AquinError {
  constructor(message: string) {
    super(message, 429);
    this.name = "RateLimitError";
  }
}

export class ModelNotFoundError extends AquinError {
  constructor(message: string) {
    super(message, 404);
    this.name = "ModelNotFoundError";
  }
}

export class InferenceError extends AquinError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = "InferenceError";
  }
}