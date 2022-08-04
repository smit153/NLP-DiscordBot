const { Client, GatewayIntentBits } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const getResponse = async (statement) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: statement,
    temperature: 0,
    max_tokens: 60,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  return response.data.choices[0].text;
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.once("ready", () => {
  console.log("BOT IS ONLINE");
});
client.on("messageCreate", async (message) => {
  if (!(message.content[0] === "!") || message.author.bot) {
    console.log("false");
    return false;
  }
  const prompt = message.content.slice(1);
  const res = await getResponse(prompt);
  message.channel.send(res);
});
client.login(process.env.DISCORDJS_BOT_TOKEN);
