const axios = require('axios');
const webHookURL = process.env.SLACK_WEBHOOK_URL;
const executionStatus = process.env.STATUS || "failed";

console.log("Sending message to Slack. Status: " + executionStatus);

let message = {
    "username": "Automated test", // This will appear as user name who posts the message
    "text": "UI automate tests",
    "icon_emoji": ":no_entry:", // User icon, default value
    "blocks": [    {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:computer: *test env*: ${process.env.JOB_NAME}`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:tyk17: *triggered by*: ${process.env.EVENT_TRIGGER}`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:link: <https://github.com/${process.env.FRAMEWORK_REPO}/actions/runs/${process.env.JOB_RUN_ID}|Execution page>`
        }
      },
    ],
    "attachments": [],
};

if (executionStatus === "success") {
  message.icon_emoji = ":white_check_mark:";
  message.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `:rickroll: *Tests passed!*`
    }
  })
} else {
  message.icon_emoji = ":no_entry:";
  message.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `:poop: *Tests failed!*`
    }
  })
}

axios.post(webHookURL, message).then(() => {
    console.log("Message sent to Slack");
    }).catch((error) => {
    console.log(error);
    }); 





