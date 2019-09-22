const Twilio = require("twilio");
const giveMeAJoke = require("give-me-a-joke");

exports.handler = function(event, context, callback) {
  giveMeAJoke.getRandomDadJoke(joke => {
    let twiml = new Twilio.twiml.MessagingResponse();
    twiml.message(joke);
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "text/xml"
      },
      body: twiml.toString()
    });
  });
};
