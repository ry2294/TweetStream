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

utilInsertTweet.insertWOEID = function(woeid, city, country) {
    dynamodbDoc.put({
        TableName: "place_tbl",
        Item: {
            "woeid": woeid,
            "city": city,
            "country": country,
            "tweetCount": 0,
            "neutral": 0,
            "negative": 0,
            "positive": 0,
            "sentimenterror": 0,
            "fetchTrends": 0,
            "trends": "Top Trending topics: "
        }
    }, function(error, data) {
        if(error) console.log("insert woeid error = " + JSON.stringify(error));
    });
};

utilInsertTweet.insertTweet = function(tweetData) {
    var params = {
        TableName: "tweet_tbl",
        Item: {
            "tweetId":  tweetData.tweetId,
            "woeid": tweetData.woeid,
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
           console.log("insertTweet Error : ", JSON.stringify(error));
        } else {
            sqs.sendMessage({
                MessageBody: tweetData.tweetId,
                QueueUrl: config.sqs.queueurl,
                DelaySeconds: 0
            }, function (error, data) {
                if (error) console.log("SQS Error = ", error);
            });
       }
    });
};

module.exports = utilInsertTweet;