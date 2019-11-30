# Twitter Playlist

Make a website that plays all videos/GIFs from a Twitter account
Demo at <http://videodrone.eddiecameron.fun>

### WOT IT IS
A dirty simple Node server that will load all video & gifs from the given twitter 
account, and serve a website that plays them all randomly.

### HOW TO DO
- Set up a twitter dev account and app at <https://apps.twitter.com> if you haven't already
- Fill in your app's keys/secrets at the top of index.js (instead of "process.env.BLAH")
- Start server `node index`
- Browse to <http://localhost:3000>
- Enter a timeline and hit Send. It'll print an ugly error if it fails
- Watch those vids!
