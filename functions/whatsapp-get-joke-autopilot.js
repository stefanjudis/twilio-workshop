const giveMeAJoke = require("give-me-a-joke");

exports.handler = function(event, context, callback) {
  giveMeAJoke.getRandomDadJoke(joke => {
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        actions: [
          {
            say: `${joke}`
          },
          {
            collect: {
              name: "joke_answer",
              questions: [
                {
                  question: "Did you like it?",
                  name: "joke_yes_no",
                  type: "Twilio.YES_NO"
                },
                {
                  question: "What would be the rating of the joke? 1 to 10",
                  name: "joke_score",
                  type: "Twilio.NUMBER"
                },
                {
                  question: "Thanks! What was good and bad about it?",
                  name: "joke_reason"
                }
              ],
              on_complete: {
                redirect: {
                  method: "POST",
                  uri: "task://complete_survey"
                }
              }
            }
          }
        ]
      })
    });
  });
};
