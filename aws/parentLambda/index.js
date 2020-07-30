const AWS = require("aws-sdk");

exports.handler = async (event) => {
  let allArticles = [];

  const params = {
    FunctionName: "",
    InvocationType: "RequestResponse",
    LogType: "Tail",
    Payload: JSON.stringify({ searchString: "katowice" }), //TO DO searchString passed from client with API Gateway
  };

  params.FunctionName =
    "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-wprost";
  const wprostLambdaResult = await new AWS.Lambda().invoke(params).promise();
  const wprostArticles = JSON.parse(JSON.parse(wprostLambdaResult.Payload))
    .body;

  params.FunctionName =
    "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-dziennik";
  const dziennikLambdaResult = await new AWS.Lambda().invoke(params).promise();
  const dziennikArticles = JSON.parse(JSON.parse(dziennikLambdaResult.Payload))
    .body;

  params.FunctionName =
    "arn:aws:lambda:eu-central-1:286935822615:function:wyszukiwarka-child-oko";
  const okoLambdaResult = await new AWS.Lambda().invoke(params).promise();
  const okoArticles = JSON.parse(JSON.parse(okoLambdaResult.Payload)).body;

  allArticles = [...wprostArticles, ...dziennikArticles, ...okoArticles];
  shuffle(allArticles);
  return allArticles;
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
