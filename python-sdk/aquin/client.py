import httpx
from dataclasses import dataclass
from aquin.exceptions import (
    AquinError,
    InvalidKeyError,
    InsufficientCreditsError,
    RateLimitError,
    ModelNotFoundError,
    InferenceError,
)

DEFAULT_BASE_URL = "https://www.aquin.app"


@dataclass
class CompletionResponse:
    text: str
    tokens_in: int
    tokens_out: int


class AquinClient:
    def __init__(self, api_key: str, base_url: str = DEFAULT_BASE_URL):
        if not api_key:
            raise ValueError("api_key is required")
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")

    def complete(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.7,
        system_prompt: str = None,
    ) -> CompletionResponse:
        try:
            res = httpx.post(
                f"{self._base_url}/api/v1/model",
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "messages": self._build_messages(prompt, system_prompt),
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
                timeout=120,
                follow_redirects=True,
            )
        except httpx.ConnectError:
            raise InferenceError("Could not connect to Aquin API.")
        except httpx.TimeoutException:
            raise InferenceError("Request timed out.")

        return self._handle_response(res)

    async def acomplete(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.7,
        system_prompt: str = None,
    ) -> CompletionResponse:
        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(
                    f"{self._base_url}/api/v1/model",
                    headers={
                        "Authorization": f"Bearer {self._api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "messages": self._build_messages(prompt, system_prompt),
                        "max_tokens": max_tokens,
                        "temperature": temperature,
                    },
                    timeout=120,
                    follow_redirects=True,
                )
            except httpx.ConnectError:
                raise InferenceError("Could not connect to Aquin API.")
            except httpx.TimeoutException:
                raise InferenceError("Request timed out.")

        return self._handle_response(res)

    def _build_messages(self, prompt: str, system_prompt: str = None) -> list:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        return messages

    def _handle_response(self, res: httpx.Response) -> CompletionResponse:
        if res.status_code == 200:
            data = res.json()
            return CompletionResponse(
                text=data["text"],
                tokens_in=data["tokens_in"],
                tokens_out=data["tokens_out"],
            )

        try:
            error_msg = res.json().get("error", "Unknown error")
        except Exception:
            error_msg = f"HTTP {res.status_code}: {res.text or 'empty response'}"

        match res.status_code:
            case 401: raise InvalidKeyError(error_msg, 401)
            case 402: raise InsufficientCreditsError(error_msg, 402)
            case 404: raise ModelNotFoundError(error_msg, 404)
            case 429: raise RateLimitError(error_msg, 429)
            case 502 | 503: raise InferenceError(error_msg, res.status_code)
            case _: raise AquinError(error_msg, res.status_code)