const AWS = require("aws-sdk");

exports.handler = async (event) => {
  let body;
  let statusCode = "200";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };

  try {
    if (event.httpMethod === "POST") {
      body = [];
      const data = JSON.parse(event.body);
      const params = {
        FunctionName: "",
        InvocationType: "RequestResponse",
        LogType: "Tail",
        Payload: JSON.stringify({ searchString: data.searchString }), //TO DO searchString passed from client with API Gateway
      };

      params.FunctionName =
        "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-wprost";
      const wprostLambdaResult = await new AWS.Lambda()
        .invoke(params)
        .promise();
      const wprostArticles = JSON.parse(JSON.parse(wprostLambdaResult.Payload))
        .body;

      params.FunctionName =
        "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-dziennik";
      const dziennikLambdaResult = await new AWS.Lambda()
        .invoke(params)
        .promise();
      const dziennikArticles = JSON.parse(
        JSON.parse(dziennikLambdaResult.Payload)
      ).body;

      params.FunctionName =
        "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-oko";
      const okoLambdaResult = await new AWS.Lambda().invoke(params).promise();
      const okoArticles = JSON.parse(JSON.parse(okoLambdaResult.Payload)).body;

      params.FunctionName =
        "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-niezalezna";
      const niezaleznaLambdaResult = await new AWS.Lambda()
        .invoke(params)
        .promise();
      const niezaleznaArticles = JSON.parse(
        JSON.parse(niezaleznaLambdaResult.Payload)
      ).body;

      body = [
        ...wprostArticles,
        ...dziennikArticles,
        ...okoArticles,
        ...niezaleznaArticles,
      ];
      body.forEach((item, i) => (item.id = i + 1));
      shuffle(body);
    } else {
      throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = "400";
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    headers,
    body,
  };
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  array.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  return array;
}
