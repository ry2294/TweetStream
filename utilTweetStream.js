var Twitter = require('twitter');
var config = require('./config');
var utilInsertTweet = require('./utilInsertTweet');
var _ = require('underscore');

var client = new Twitter({
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token_key: config.twitter.accessTokenKey,
    access_token_secret: config.twitter.accessTokenSecret
});

var utilTweetStream = {};

var woeids = {};

var startStreaming = function() {
    // stream tweets for entire world
    client.stream('statuses/filter', {'locations':'-180,-90,180,90'},function(stream){
      stream.on('data', function(tweet) {
        
        if(tweet.id_str != null
            && tweet.text != null
            && tweet.user != null && tweet.user.name != null
            && tweet.geo != null
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
            tweetData.country = tweet.place.country.toString();
            var coordinates = tweet.place.bounding_box.coordinates[0];
            tweetData.x = coordinates[0][0];
            tweetData.y = coordinates[0][1];
            tweetData.woeid = (woeids != null &&
                woeids[tweetData.country] != null &&
                woeids[tweetData.country][tweetData.city] != null &&
                woeids[tweetData.country][tweetData.city]["woeid"] != null) ?  woeids[tweetData.country][tweetData.city]["woeid"]
                : null;
            if(tweetData.woeid != null)
                utilInsertTweet.insertTweet(tweetData);
        }
        
      });

      stream.on('error', function(error) {
        console.log(error);
      });
    });
};

var addWoeid = function(location) {
    if(location != null &&
        location.placeType != null &&
        location.placeType.code == 7 &&
        location.name != null &&
        location.country != null &&
        location.woeid != null) {
        var woeid = location.woeid.toString();
        if(woeids[location.country] == null)
            woeids[location.country] = {};
        var country = woeids[location.country.toString()];
        if(country[location.name] == null)
            country[location.name] = {};
        var city = country[location.name.toString()];
        city.woeid = woeid;
        utilInsertTweet.insertWOEID(woeid, location.name, location.country);
    }
};

utilTweetStream.getTrendsAvailable = function() {
    client.get('trends/available', function(error, locations, response) {
        if(error) console.log('error = ' + error);
        else {
            console.log('locations = ' + JSON.stringify(locations[0]));
            _.each(locations, addWoeid);
            console.log('India Woeids = ' + JSON.stringify(woeids['India']));
            startStreaming();
        }
    });
};

module.exports = utilTweetStream;