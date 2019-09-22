const giveMeAJoke = require("give-me-a-joke");

exports.handler = function(event, context, callback) {
  giveMeAJoke.getRandomDadJoke(joke => {
    callback(null, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        joke
      })
    });
  });
};
