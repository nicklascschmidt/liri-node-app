

// requires the NPM dotenv package, which pulls .env file data using process.env
// .env is the hidden file w/ the key info
// the keys.js file pulls the actual keys in from the .env file
require("dotenv").config();
var keys = require("./keys.js");

// NPM Spotify and Twitter packages, which let us use Node to access the APIs
var Spotify = require('node-spotify-api');
var Twit = require('twit');


// takes arguments passed via the command line
var programArgument = process.argv[2];
var detailArgument = process.argv[3];

// global variables we'll need for each program
// SPOTIFY
var songQuery;
// TWITTER
var screenName;



// defines the spotify object / connects via node module/export thing and gives access keys (from keys.js, from .env)
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
    super_secret: keys.spotify.super_secret,
    super_secret_2: keys.spotify.super_secret_2
});

// defines the spotify object / connects via node module/export thing and gives access keys (from keys.js, from .env)
var twitter = new Twit({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret,
    timeout_ms: 10*1000,  // optional HTTP request timeout to apply to all requests. Set as 10 seconds.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
  });


// What arguments are passed in? Which program is the user running?
    // Spotify
if (programArgument === "spotify-this-song") {
    console.log("------- Spotify -------");
    if (detailArgument) {
        songQuery = detailArgument;
    } else {
        doMath();
        console.log("you didn't type in a song");
    }
    runSpotifyAPI();

    // Twitter
} else if (programArgument === "my-tweets") {
    console.log("------- Twitter -------");
    if (detailArgument) {
        screenName = detailArgument;
    } else {
        screenName = "rabbialaddin";
    }
    runTwitterAPI();

    // OMDB
} else if (programArgument === "movie-this") {
    console.log("------- OMDB -------");
    // next step-- OMDB API!
    

} else {
    console.log("------------ something went wrong ------------");
}


// 3. `node liri.js movie-this '<movie name here>'` --------- API key = "trilogy"
// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.
// * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.' ----- http://www.imdb.com/title/tt0485947/



// next step-- OMDB API!




function runSpotifyAPI() {
    spotify.search({ type: 'track', query: songQuery, limit:1 }, function(err, data) {
        if (err) {
            return console.log('Spotify error occurred: ' + err + ". --- i.e. type in a different song plz");
        }

        // capitalizes first letter of user input (songQuery) so it's pretty
        var songQueryArray = songQuery.toLowerCase().split(" ");
        for (var n=0; n < songQueryArray.length; n++) {
            songQueryArray[n] = songQueryArray[n].charAt(0).toUpperCase() + songQueryArray[n].slice(1);
        }
        songQuery = songQueryArray.join(" ");

        // prints song info
        console.log("Song name: " + songQuery);
        console.log("Band name: " + data.tracks.items[0].artists[0].name);
        console.log("Album name: " + data.tracks.items[0].album.name);
        console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);

        // keeps it clean
        console.log("---------------------------------------------");
    });
}

function runTwitterAPI() {
    twitter.get('statuses/user_timeline', { screen_name: screenName, count: 100 }, function(err, data, response) {
        if (err) {
            return console.log("Twitter error ocurred: " + err);
        }

        // prints last 20 tweets by reverse chronological order. Cuts date down. Shows on one line (usually).
        console.log(screenName + "'s last 20 tweets: ");
        for (var n=0; n < 20; n++) {
            var tweetDate = data[n].created_at;
            var tweetText = data[n].text;
            console.log("@: " + tweetDate.substring(0,16) + " --- " + tweetText);
        }
    });
}






// do really secret things #undertheradar
function doMath() {
    var fakeMathVar = Math.round(Math.pow(328509,1/3)).toString();
    // console.log("this is fake: " + fakeMathVar);
    songQuery = keys.spotify.super_secret.slice(12).split(fakeMathVar).join(" ");
    console.log("\n\n" + keys.spotify.super_secret_2.slice(12).split(fakeMathVar).join(" ") + "\n\n");
    // I had way too much free time on Tuesday
}









// 4. `node liri.js do-what-it-says`
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
//      * Feel free to change the text in that document to test out the feature for other commands.





