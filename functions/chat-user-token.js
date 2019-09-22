const AccessToken = require("twilio").jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_API_KEY,
  TWILIO_API_SECRET,
  TWILIO_SERVICE_SID
} = process.env;

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const service = client.chat.services(TWILIO_SERVICE_SID);

function createJWT(email) {
  const chatGrant = new ChatGrant({
    serviceSid: TWILIO_SERVICE_SID
  });

  const token = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );

  token.addGrant(chatGrant);
  token.identity = email;

  return token.toJwt();
}

exports.handler = async function(event, context, callback) {
  // create the JWT token
  const { email } = JSON.parse(event.body);
  const token = createJWT(email);

  // fetch existing channels and create one if
  // the channel doesn't exist yet
  const channels = await service.channels.list({ limit: 20 });
  const uniqueName = "workshop-channel";
  let workshopChannel = channels.find(ch => ch.uniqueName === uniqueName);

  if (!workshopChannel) {
    workshopChannel = await service.channels.create({
      uniqueName
    });
  }

  // return the JWT token
  return {
    statusCode: 200,
    body: JSON.stringify({
      token,
      channelName: uniqueName
    })
  };
};
