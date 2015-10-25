var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: '', 
    secretAccessKey: ''});

AWS.config.update({region: 'us-west-2'});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var utilDynamoDB = {};

utilDynamoDB.tweetNotExists = function(tweetData) {
    var tweetExistsParam = {
        TableName : "tweet_tbl",
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
        TableName: "tweet_tbl",
        Item: {
            "tweetId":  tweetData.tweetId,
            "text": tweetData.text,
            "hashTag":  tweetData.hashTag,
            "createdTime": tweetData.timeStamp,
            "placeId": tweetData.place_id,
            "userName": tweetData.userName
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

utilDynamoDB.placeNotExists = function(tweetData) {
	var placeExistsParam = {
        TableName : "place_tbl",
        KeyConditionExpression: "#pId = :pval",
        ExpressionAttributeNames:{
            "#pId": "placeId"
        },
        ExpressionAttributeValues: {
            ":pval": tweetData.place_id
        }
    };

    dynamodbDoc.query(placeExistsParam, function(error, data) {
        if (error) console.error("placeNotExists Error: ", JSON.stringify(error)); 
        else {
            console.log("data : " + JSON.stringify(data));
            if(data.Count == 0) {
                insertPlace(tweetData);
            } else {
                console.log("Place Exists. So not inserting");
                updatePlace(tweetData);
            }
        }
    });
};

var insertPlace = function(tweetData) {
    var params = {
        TableName: "place_tbl",
        Item: {
            "placeId":  tweetData.place_id,
            "city": tweetData.city,
            "countryCode":  tweetData.countryCode,
            "country": tweetData.country,
            "x": tweetData.x,
            "y": tweetData.y,
            "tweetCount": 0
        }
    };

    dynamodbDoc.put(params, function(error, data) {
       if (error) {
           console.error("insertPlace Error : ", error);
       } else {
           console.log("insertPlace Succeeded:", JSON.stringify(data));
           updatePlace(tweetData);
       }
    });
};

var updatePlace = function(tweetData) {
	var params = {
	    TableName: "place_tbl",
	    Key:{
	        "placeId": tweetData.place_id
	    },
	    UpdateExpression: "set tweetCount = tweetCount + :val",
	    ExpressionAttributeValues:{
	        ":val":1
	    },
	    ReturnValues:"UPDATED_NEW"
	};

	dynamodbDoc.update(params, function(error, data) {
	    if (error) {
	        console.error("updatePlace Error : " + JSON.stringify(error));
	    } else {
	        console.log("updatePlace succeeded:" + JSON.stringify(data));
	    }
	});
};

utilDynamoDB.hashTagPlaceNotExists = function(tweetData) {
	var hashTagPlaceExistsParam = {
        TableName : "hashTagToPlace_tbl",
        KeyConditionExpression: "#pId = :pval and hashTag = :hval",
        ExpressionAttributeNames:{
            "#pId": "placeId"
        },
        ExpressionAttributeValues: {
            ":pval": tweetData.place_id,
            ":hval": tweetData.hashTag
        }
    };

    dynamodbDoc.query(hashTagPlaceExistsParam, function(error, data) {
        if (error) console.error("hashTagPlaceExistsParam Error: ", JSON.stringify(error)); 
        else {
            console.log("data : " + JSON.stringify(data));
            if(data.Count == 0) {
                inserthashTagPlace(tweetData);
            } else {
                console.log("Hash Tag to Place Exists. So not inserting");
                // 
            }
        }
    });
};

var inserthashTagPlace = function(tweetData) {
    var params = {
        TableName: "hashTagToPlace_tbl",
        Item: {
            "placeId":  tweetData.place_id,
            "hashTag":  tweetData.hashTag,
            "tweetCount": 0
        }
    };

    dynamodbDoc.put(params, function(error, data) {
       if (error) {
           console.error("inserthashTagPlace Error : ", error);
       } else {
           console.log("inserthashTagPlace Succeeded:", JSON.stringify(data));
           updatehashTagPlace(tweetData);
       }
    });
};

var updatehashTagPlace = function(tweetData) {
	var params = {
	    TableName: "hashTagToPlace_tbl",
	    Key:{
	        "placeId": tweetData.place_id,
	        "hashTag": tweetData.hashTag
	    },
	    UpdateExpression: "set tweetCount = tweetCount + :val",
	    ExpressionAttributeValues:{
	        ":val":1
	    },
	    ReturnValues:"UPDATED_NEW"
	};

	dynamodbDoc.update(params, function(error, data) {
	    if (error) {
	        console.error("hashTagPlace Error : " + JSON.stringify(error));
	    } else {
	        console.log("hashTagPlace succeeded:" + JSON.stringify(data));
	    }
	});
};

module.exports = utilDynamoDB;