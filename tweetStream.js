var express = require('express');
var Twitter = require('twitter');
var config = require('./config');
var sql = require('mssql');

var client = new Twitter({
	consumer_key: config.twitter.consumerKey,
	consumer_secret: config.twitter.consumerSecret,
	access_token_key: config.twitter.accessTokenKey,
	access_token_secret: config.twitter.accessTokenSecret
});


var rdsConfig = {
    user: config.twitter.username,
    password: config.twitter.password,
    server: config.twitter.host,
    database: config.twitter.database
};

var insertTweet = function(tweet) {
	
	var connection = new sql.Connection(rdsConfig, function(error) {
		if(error) {
			console.log('sql connection failed');
		} else {
            console.log('before request');
			var request = new sql.Request(connection);
			request.input('tweetId', sql.NVarChar, tweet.id_str);
            request.input('text', sql.NVarChar, tweet.text);
			request.input('hashTag', sql.NVarChar, tweet.entities.hashtags[0].text);
			request.input('userId', sql.NVarChar, tweet.user.userId);
			request.input('userName', sql.NVarChar, tweet.user.name);
			request.input('geo', sql.NVarChar, JSON.stringify(tweet.geo));
			request.input('coordinates', sql.NVarChar, JSON.stringify(tweet.coordinates));
			request.input('place_id', sql.NVarChar, tweet.place.id);
			request.input('placeType', sql.NVarChar, tweet.place.place_type);
			request.input('placeName', sql.NVarChar, tweet.place.name);
			request.input('fullName', sql.NVarChar, tweet.place.full_name);
			request.input('countryCode', sql.NVarChar, tweet.place.country_code);
			request.input('country', sql.NVarChar, tweet.place.country);
			request.input('boundingBox', sql.NVarChar, tweet.place.bounding_box);
			request.execute('insertTweet', function(error, recordsets, returnValue) {
			    if(error) {
			    	console.log('Inside request error = ' + error);
                    console.log('tweet id = ' + tweet.id);
				} else {
			    	console.log('Request success');
				}
			});
		}
	});

};

// stream tweets for entire world
client.stream('statuses/filter', {'locations':'-180,-90,180,90'},function(stream){
  stream.on('data', function(tweet) {
  	
    if(tweet.id_str != null
    	&& tweet.text != null
    	&& tweet.user != null
    	&& tweet.geo != null 
    	&& tweet.coordinates != null 
    	&& tweet.place != null
    	&& tweet.entities != null
    	&& tweet.entities.hashtags != null
    	&& tweet.entities.hashtags.length > 0) {
    	
    	//console.log('tweet = ' + JSON.stringify(tweet));
    	insertTweet(tweet);
	}
	
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
