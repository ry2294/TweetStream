var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAJREVNX3K2ENDJP7Q', 
    secretAccessKey: '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'});

AWS.config.update({region: 'us-west-2'});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var utilInsertTweet = {};

utilInsertTweet.ifTweetNotExistsInsert = function(tweetData) {
    var tweetExistsParam = {
        TableName : "tweetWithPlace_tbl",
        KeyConditionExpression: "#tId = :tval",
        ExpressionAttributeNames:{
            "#tId": "tweetId"
        },
        ExpressionAttributeValues: {
            ":tval": tweetData.tweetId
        }
    };

    dynamodbDoc.query(tweetExistsParam, function(error, data) {
        if (error) {
            console.error("Tweet Exists Error: ", JSON.stringify(error));
        } else {
            console.log("data : " + JSON.stringify(data));
            if(data.Count == 0) {
                insertTweet(tweetData);
            } else {
                console.log("Tweet Exists");
            }
        }
    });
};

var insertTweet = function(tweetData) {
    var params = {
        TableName: "tweetWithPlace_tbl",
        Item: {
            "tweetId":  tweetData.tweetId,
            "text": tweetData.text,
            "hashTag":  tweetData.hashTag,
            "createdTime": tweetData.timeStamp,
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
       }
    });
};

module.exports = utilInsertTweet;