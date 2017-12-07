var Twitter = require('twitter');
var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

app.get('/', function(req, res){
  res.sendFile( __dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    io.emit('media', allTweets);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var client = new Twitter({
  consumer_key: 'YOUR CONSUMER KEY',
  consumer_secret: 'YOUR CONSUMER SECRET',
  access_token_key: 'YOUR ACCESS TOKEN',
  access_token_secret: 'YOUR ACCESS TOKEN SECRET'
});

var timelineToFetch = `PUBLIC TIMELINE SCREENNAME`  // timeline to fetch videos from, wihtout the @

var params = { screen_name: timelineToFetch, trim_user: true, count: '200' };

var oldestTweetId;
var allTweets = [];

function getNextUpdates() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.forEach(tweet => {
                if (tweet.extended_entities == null || tweet.extended_entities.media.length == 0) {
                    // not a media tweet
                    return;
                }
            
                var foundMedia = false;
                var mediaToShow;
                for (let index = 0; index < tweet.extended_entities.media.length; index++) {
                    mediaToShow = tweet.extended_entities.media[index];
                    if (mediaToShow.type == "video" || mediaToShow.type == "animated_gif") {
                        foundMedia = true;
                        break;
                    }
                }

                if (!foundMedia) {
                    // no media
                    return;
                }

                allTweets.push(mediaToShow);
            });

            var oldestId = tweets[tweets.length - 1].id_str;
            console.log(allTweets.length);

            if (oldestId != params["max_id"]) {
                // still might be more tweets
                params["max_id"] = oldestId;
                getNextUpdates();
            }
            else
                console.log("...done!");    
        }
    });
}

getNextUpdates();