var Twitter = require('twitter');
var config = require('./config');
var utilInsertTweet = require('./utilInsertTweet');

var client = new Twitter({
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token_key: config.twitter.accessTokenKey,
    access_token_secret: config.twitter.accessTokenSecret
});

var utilTweetStream = {};

utilTweetStream.startStreaming = function() {
    // stream tweets for entire world
    client.stream('statuses/filter', {'locations':'-180,-90,180,90'},function(stream){
      stream.on('data', function(tweet) {
      	
        if(tweet.id_str != null
            && tweet.text != null
        	&& tweet.user != null && tweet.user.name != null
        	&& tweet.place != null
            && tweet.place.id != null
            && tweet.place.place_type == 'city'
            && tweet.place.name != null
            && tweet.place.country != null
            && tweet.place.bounding_box != null
            && tweet.place.bounding_box.type == 'Polygon'
            && tweet.place.bounding_box.coordinates != null
            && tweet.place.bounding_box.coordinates[0].length == 4)
        {
            var tweetData = {};
            tweetData.tweetId = tweet.id_str;
            tweetData.text = tweet.text;
            tweetData.userName = tweet.user.name;
            tweetData.place_id = tweet.place.id;
            tweetData.city = tweet.place.name;
            tweetData.country = JSON.stringify(tweet.place.country);
            var coordinates = tweet.place.bounding_box.coordinates[0];
            tweetData.x = coordinates[0][0];
            tweetData.y = coordinates[0][1];

            utilInsertTweet.insertTweet(tweetData);
    	}
    	
      });

      stream.on('error', function(error) {
        console.log(error);
      });
    });
};

module.exports = utilTweetStream;