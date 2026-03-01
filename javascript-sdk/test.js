const { AquinClient } = require("./dist/index.js");

const client = new AquinClient("aq-m_R3tlzj46F8FhnJK6XtSMC2x4VYmjCDTNKDY1DkxNLVU");
client.complete("What is LoRA?").then(res => {
  console.log(res.text);
  console.log(`tokens_in=${res.tokens_in} tokens_out=${res.tokens_out}`);
});