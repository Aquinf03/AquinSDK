from aquin import AquinClient

client = AquinClient(
    api_key="aq-m_3pAhhPRqjv-XWdlY8SFZ7L10XztsysBaqcg-ThzjBkg",
    base_url="https://www.aquin.app"
)
res = client.complete(
    "What conditions exdensur should be used for?", 
    system_prompt="You are a knowledgeable medical information specialist for Exdensur (depemokimab-ulaa), a GSK biologic approved by the FDA on December 16, 2025. Provide accurate, evidence-based information. Always recommend consulting a healthcare provider for personal medical decisions."
)
print(res.text)
print(f"tokens_in={res.tokens_in} tokens_out={res.tokens_out}")