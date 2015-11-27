var AWS = require('aws-sdk');
var config = require('./config');
var sqs = new AWS.SQS({
    accessKeyId: config.dynamodb.accessKeyId, 
    secretAccessKey: config.dynamodb.secretAccessKey,
    region: config.dynamodb.region});

AWS.config.update({
    accessKeyId: config.dynamodb.accessKeyId, 
    secretAccessKey: config.dynamodb.secretAccessKey,
    region: config.dynamodb.region});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var utilInsertTweet = {};

utilInsertTweet.insertTweet = function(tweetData) {
    var params = {
        TableName: "tweet_tbl",
        Item: {
            "tweetId":  tweetData.tweetId,
            "text": tweetData.text,
            "placeId": tweetData.place_id,
            "userName": tweetData.userName,
            "city": tweetData.city,
            "country": tweetData.country,
            "x": tweetData.x,
            "y": tweetData.y
        }
    };

    dynamodbDoc.put(params, function(error, data) {
        if (error) {
           console.error("insertTweet Error : ", error);
        } else {
            console.log("insertTweet Succeeded:", JSON.stringify(data));
            sqs.sendMessage({
                MessageBody: tweetData.tweetId,
                QueueUrl: config.sqs.queueurl,
                DelaySeconds: 0
            }, function (error, data) {
                if (error) {
                    console.log("SQS Error = ", error);
                } else {
                    console.log("SQS Success = " + data);
                }
            });
       }
    });
};

module.exports = utilInsertTweet;