from aquin import AquinClient

client = AquinClient(
    api_key="aq-m_R3tlzj46F8FhnJK6XtSMC2x4VYmjCDTNKDY1DkxNLVU",
    base_url="https://www.aquin.app"
)
res = client.complete("What is LoRA?")
print(res.text)
print(f"tokens_in={res.tokens_in} tokens_out={res.tokens_out}")