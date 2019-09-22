exports.handler = function(event, context, callback) {
  console.log(event.body);

  callback(null, {
    statusCode: 200,
    body: ""
  });
};
