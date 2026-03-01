class AquinError(Exception):
    """Base exception for all Aquin SDK errors."""
    def __init__(self, message: str, status_code: int = None):
        super().__init__(message)
        self.status_code = status_code


class InvalidKeyError(AquinError):
    """API key is invalid or disabled."""
    pass


class InsufficientCreditsError(AquinError):
    """Account does not have enough credits."""
    pass


class RateLimitError(AquinError):
    """Too many requests."""
    pass


class ModelNotFoundError(AquinError):
    """The model for this API key has not been trained yet."""
    pass


class InferenceError(AquinError):
    """The inference server failed."""
    pass