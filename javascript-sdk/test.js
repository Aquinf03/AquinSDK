const { AquinClient } = require("./dist/index.js");

const client = new AquinClient("aq-m_3pAhhPRqjv-XWdlY8SFZ7L10XztsysBaqcg-ThzjBkg");
client.complete("What conditions exdensur should be used for?", {
  system_prompt: "You are a knowledgeable medical information specialist for Exdensur."
}).then(res => {
  console.log(res.text);
  console.log(`tokens_in=${res.tokens_in} tokens_out=${res.tokens_out}`);
});