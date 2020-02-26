/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageTeststorageName = process.env.STORAGE_TESTSTORAGE_NAME
var storageTeststorageArn = process.env.STORAGE_TESTSTORAGE_ARN

Amplify Params - DO NOT EDIT */

const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   awsServerlessExpress.proxy(server, event, context);
// };

var AWS = require('aws-sdk');
var region = process.env.REGION
var storageTeststorageName = process.env.STORAGE_TESTSTORAGE_NAME
AWS.config.update({region: region});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var ddb_table_name = storageTeststorageName
var ddb_primary_key = 'id';

function write(params, context){
    ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}
 

exports.handler = function (event, context) { //eslint-disable-line
  
  var params = {
    TableName: ddb_table_name,
    Item: AWS.DynamoDB.Converter.input(event.arguments)
  };
  
  console.log('len: ' + Object.keys(event).length)
  if (Object.keys(event).length > 0) {
    write(params, context);
  } 
}; 
