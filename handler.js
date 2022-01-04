"use strict";

const axios = require("axios");
const querystring = require("querystring");

module.exports.clap = async (event) => {
  const { text, user_id, response_url } = querystring.parse(event.body);
  if (!text) {
    return {
      statusCode: 200,
      body: `You need to submit text in order to use clapper`,
      headers: { "X-Slack-No-Retry": 1 },
    };
  }

  const words = text.split(" ");

  let output = "";

  if (words.length === 1) {
    output = `:clap: ${words[0]} :clap:`;
  } else {
    for (let i = 0; i < words.length; i++) {
      output += i !== words.length - 1 ? `${words[i]} :clap: ` : words[i];
    }
  }

  const response = JSON.stringify({
    attachments: [
      {
        text: output,
      },
    ],
    response_type: "in_channel",
    text: `<@${user_id}>`,
  });

  await axios.post(response_url, response).catch((e) => console.log(e));

  return { statusCode: 200 };
};
