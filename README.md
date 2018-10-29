# Twitter Playlist

Make a website that plays all videos/GIFs from a Twitter account

### WOT IT IS
A dirty simple Node server that will load all video & gifs from the given twitter 
account, and serve a website that plays them all randomly.

### HOW TO DO
- Set up a twitter dev account and app at <https://apps.twitter.com> if you haven't already
- Fill in your app's keys/secrets at the top of index.js
- Fill in the twitter screenname you want to get media from, as `timelineToFetch` in index.js
- Start server `node index`
- Wait a bit for server to parse all the urls (it'll print `done`), then browse to <http://localhost:3000>
- Watch those vids!
