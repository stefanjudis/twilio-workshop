const qs = require("querystring");

exports.handler = function(event, context, callback) {
  const body = qs.parse(event.body);
  const data = JSON.parse(body.Memory).twilio.collected_data.joke_answer
    .answers;
  console.log("Result", data);

  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      actions: [
        {
          say: `Thank you! Anything else I can do?`
        },
        {
          listen: {
            tasks: ["tell_a_joke", "goodbye"]
          }
        }
      ]
    })
  });
};
