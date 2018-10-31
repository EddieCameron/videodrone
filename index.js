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

    socket.on('timeline', function (timeline) {
        // request media from timeline
        getMediaFromTimeline(timeline,
            function (progress) {
                socket.emit('fetchProgress', progress);
            },
            function (didSucceed, error, mediaList) {
                socket.emit('mediaReceived', didSucceed, error, mediaList);
            });
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

http.listen(port, function(){
  console.log('listening on ' + port );
});

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function getMediaFromTimeline(timelineToFetch, onProgressFunction, onComplete) {
    var params = { screen_name: timelineToFetch, trim_user: true, count: '200' };
    var allTweets = [];

    client.get('users/show', { screen_name: timelineToFetch, include_entities: false }, function (error, user, response) {
        if (error) {
            onComplete(false, error, allTweets);
        }
        else {
            var numTweets = user.statuses_count;
            var processedTweets = 0;

            getNextUpdates(params, allTweets, function (tweetsInBatch) {
                processedTweets += tweetsInBatch;
                var processedPercent = Math.round(processedTweets / numTweets * 100);
                onProgressFunction(processedPercent);
                },
                onComplete);
        }
    });
}

function getNextUpdates(params, tweetList, onProgressMade, onMediaReceived) {
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

                tweetList.push(mediaToShow);
            });

            var oldestId = tweets[tweets.length - 1].id_str;
            onProgressMade(tweets.length);

            if (oldestId != params["max_id"]) {
                // still might be more tweets
                params["max_id"] = oldestId;
                getNextUpdates(params, tweetList, onProgressMade, onMediaReceived);
            }
            else {
                onMediaReceived(true, "", tweetList);
            }
        }
        else {
            onMediaReceived(false, error, tweetList);
        }
    });
}

//getNextUpdates();