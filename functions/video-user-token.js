const { uniqueNamesGenerator } = require("unique-names-generator");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET } = process.env;

function createJWT(identity) {
  const videoGrant = new VideoGrant();

  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );

  token.addGrant(videoGrant);
  token.identity = identity;

  return token.toJwt();
}

exports.handler = async function(event, context, callback) {
  const identity = uniqueNamesGenerator();
  const token = createJWT(identity);

  return {
    statusCode: 200,
    body: JSON.stringify({
      token,
      identity
    })
  };
};
