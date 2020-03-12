"use strict";

const axios = require("axios");
const querystring = require("querystring");

module.exports.clap = async event => {
  const { text, user_id, response_url } = querystring.parse(event.body);
  if (!text) {
    return {
      statusCode: 200,
      body: `You need to submit text in order to use clapper`,
      headers: { "X-Slack-No-Retry": 1 }
    };
  }

  const words = text.split(" ");

  if (words.length <= 1) {
    return {
      statusCode: 200,
      body: `You need more than one word to use clapper.`,
      headers: { "X-Slack-No-Retry": 1 }
    };
  }

  let output = "";

  for (let i = 0; i < words.length; i++) {
    output += i !== words.length - 1 ? `${words[i]} :clap: ` : words[i];
  }

  const response = JSON.stringify({
    attachments: [
      {
        text: output
      }
    ],
    response_type: "in_channel",
    text: `<@${user_id}>`
  });

  await axios.post(response_url, response).catch(e => console.log(e));

  return { statusCode: 200 };
};

module.exports.redirect = async event => {
  return {
    statusCode: 302,
    headers: {
      Location:
        "https://slack.com/oauth/v2/authorize?client_id=860725329527.956870149255&scope=commands"
    },
    body: ""
  };
};
