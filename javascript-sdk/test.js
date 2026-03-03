const { AquinClient } = require("./dist/index.js");

const client = new AquinClient("aq-m_3pAhhPRqjv-XWdlY8SFZ7L10XztsysBaqcg-ThzjBkg");
client.complete("tell me about exdensur").then(res => {
  console.log(res.text);
  console.log(`tokens_in=${res.tokens_in} tokens_out=${res.tokens_out}`);
});