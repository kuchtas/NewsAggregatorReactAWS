const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const params = {
    FunctionName:
      "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-wprost",
    InvocationType: "RequestResponse",
    LogType: "Tail",
    Payload: JSON.stringify({ searchString: "katowice" }), //TO DO searchString passed from client with API Gateway
  };

  const lambdaResult = await new AWS.Lambda().invoke(params).promise();
  const resultObject = JSON.parse(lambdaResult.Payload);
  return resultObject;
};
