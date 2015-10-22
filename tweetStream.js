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

var insertTweet = function(tweetId, text, hashTag, userName, place_id, city, countryCode, country, coord_xx, coord_xy, coord_yx, coord_yy) {	
	var connection = new sql.Connection(rdsConfig, function(error) {
		if(error) {
			console.log('sql connection failed');
		} else {
            // console.log('before request');
			var request = new sql.Request(connection);

			request.input('tweetId', sql.NVarChar, tweetId);
            request.input('text', sql.NVarChar, text);
			request.input('hashTag', sql.NVarChar, hashTag);
			request.input('userName', sql.NVarChar, userName);
			request.input('place_id', sql.NVarChar, place_id);
			request.input('city', sql.NVarChar, city);
			request.input('countryCode', sql.NVarChar, countryCode);
			request.input('country', sql.NVarChar, country);
			request.input('coord_xx', sql.NVarChar, coord_xx);
            request.input('coord_xy', sql.NVarChar, coord_xx);
            request.input('coord_yx', sql.NVarChar, coord_xx);
            request.input('coord_yy', sql.NVarChar, coord_xx);
			request.execute('insertTweet', function(error, recordsets, returnValue) {
			    if(error) {
			    	console.log('Inside request error = ' + error);
                    console.log('id_str = ' + tweetId);
                    console.log('text = ' + text);
                    console.log('hashtag = ' + hashTag);
                    console.log('userName = ' + userName);
                    console.log('place_id = ' + place_id);
                    console.log('city = ' + city);
                    console.log('country_code = ' + countryCode);
                    console.log('country = ' + country);
                    
                    console.log('coordinates = ' + JSON.stringify(coordinates));
                    console.log('coordinates = ' + coord_xx);
                    console.log('coordinates = ' + coord_xy);
                    console.log('coordinates = ' + coord_yx);
                    console.log('coordinates = ' + coord_yy);
				} else {
			    	// console.log('Request success');
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
        && tweet.entities.hashtags != null
        && tweet.entities.hashtags.length > 0
        && tweet.entities.hashtags[0].text != null
    	&& tweet.user != null && tweet.user.name != null
    	&& tweet.place != null
        && tweet.place.id != null
        && tweet.place.place_type == 'city'
        && tweet.place.name != null
    	&& tweet.place.country_code != null
        && tweet.place.country != null
        && tweet.place.bounding_box != null
        && tweet.place.bounding_box.type == 'Polygon'
        && tweet.place.bounding_box.coordinates != null
        && tweet.place.bounding_box.coordinates[0].length == 4)
    {
        var tweetId = JSON.stringify(tweet.id_str);
        var text = JSON.stringify(tweet.text);
        var hashTag = JSON.stringify(tweet.entities.hashtags[0].text);
        var userName = JSON.stringify(tweet.user.name);
        var place_id = JSON.stringify(tweet.place.id);
        var city = JSON.stringify(tweet.place.name);
        var countryCode = JSON.stringify(tweet.place.country_code);
        var country = JSON.stringify(tweet.place.country);
        var coordinates = tweet.place.bounding_box.coordinates[0];
        var coord_xx = JSON.stringify(coordinates[0]);
        var coord_xy = JSON.stringify(coordinates[1]);
        var coord_yx = JSON.stringify(coordinates[2]);
        var coord_yy = JSON.stringify(coordinates[3]);
        
    	insertTweet(tweetId, text, hashTag, userName, place_id, city, countryCode, country, coord_xx, coord_xy, coord_yx, coord_yy);
	}
	
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
