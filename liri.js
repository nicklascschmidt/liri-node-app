

// requires the NPM dotenv package, which pulls .env file data using process.env
// .env is the hidden file w/ the key info
// the keys.js file pulls the actual keys in from the .env file
require("dotenv").config();
var keys = require("./keys.js");

// NPM Spotify and Twitter packages, which let us use Node to access the APIs
var Spotify = require('node-spotify-api');
var Twit = require('twit');

// OMDB - make HTTP requests to pull JSON back
var request = require("request");

// File System to pull from random.txt and push to log.txt
var fs = require("fs");

// takes arguments passed via the command line
var programArgument = process.argv[2];
var detailArgument = process.argv.slice(3).join(" ");
console.log(detailArgument);

// global variables we'll need for each program
// SPOTIFY
var songName;
// TWITTER
var screenName;
// OMDB
var movieName;



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



// ALL LOGIC HERE!!!!!

console.log("\n");

if (programArgument === "do-what-it-says") {
    console.log("-------------- DO WHAT IT SAYS --------------");
    runDoWhatItSays();
}

// What arguments are passed in? Which program is the user running?
    // Spotify
if (programArgument === "spotify-this-song") {
    console.log("----------------- Spotify -------------------");
    if (detailArgument) {
        // argument is passed in
        songName = detailArgument;
    } else {
        // default
        doMath();
        console.log("---------------------------------------------");
        console.log("you didn't type in a song");
    }
    runSpotifyAPI();

    // Twitter
} else if (programArgument === "my-tweets") {
    console.log("------------------ Twitter ------------------");
    if (detailArgument) {
        // argument is passed in
        screenName = detailArgument;
    } else {
        // defaults to loneblockbuster
        screenName = "loneblockbuster";
        console.log("---------------------------------------------");
        console.log("you didn't type in a Twitter user");
    }
    runTwitterAPI();

    // OMDB
} else if (programArgument === "movie-this") {
    console.log("-------------------- OMDB -------------------");
    if (detailArgument) {
        // argument is passed in
        movieName = detailArgument;
    } else {
        // default
        movieName = "Mr Nobody";
        console.log("---------------------------------------------");
        console.log("you didn't type in a movie");
    }
    runOMDBApi();

} else {
    console.log("----------- something went wrong ------------");
}






// ALL OF THE FUNCTIONS

function runDoWhatItSays() {
    try {
        
        var data = fs.readFileSync("random.txt").toString();
        var fileItems = data.split(",");

        programArgument = fileItems[0];
        if (fileItems[1]) {
            detailArgument = fileItems[1].replace(/"/gi, function(x) {
                return "";
            });
        } else {
            detailArgument = "";
        }
        

    } catch (error) {
        console.log(error);
    }
}

function runSpotifyAPI() {
    spotify.search({ type: 'track', query: songName, limit:1 }, function(err, data) {
        if (err) {
            return console.log('Spotify error occurred: ' + err + ". --- i.e. type in a different song plz");
        }

        // capitalizes first letter of user input (songName) so it's pretty
        var songNameArray = songName.toLowerCase().split(" ");
        for (var n=0; n < songNameArray.length; n++) {
            songNameArray[n] = songNameArray[n].charAt(0).toUpperCase() + songNameArray[n].slice(1);
        }
        songName = songNameArray.join(" ");
        
        // prints song info
        var songArray = [
            "---------------------------------------------",
            "Song name: " + songName,
            "Band name: " + data.tracks.items[0].artists[0].name,
            "Album name: " + data.tracks.items[0].album.name,
            "Preview link: " + data.tracks.items[0].external_urls.spotify,
            "---------------------------------------------\n"
        ].join("\n");
        console.log(songArray);

        // logs record in log.txt
        logOutput(songArray);


    }); // closes spotify request
}

function runTwitterAPI() {
    twitter.get('statuses/user_timeline', { screen_name: screenName, count: 100 }, function(err, data, response) {
        if (err) {
            return console.log("Twitter error ocurred: " + err);
        }

        // prints last 20 tweets by reverse chronological order. Cuts date down. Shows on one line (usually).
        console.log(screenName + "'s last 20 tweets: ");
        var tweetArray = [
            "---------------------------------------------"
        ]
        for (var n=0; n < 20; n++) {
            var tweetDate = data[n].created_at;
            var tweetText = data[n].text;
            tweetArray.push("@: " + tweetDate.substring(0,16) + " --- " + tweetText);
        }
        tweetArray.push("---------------------------------------------\n");
        var tweetArrayDisplay = tweetArray.join("\n");
        console.log(tweetArrayDisplay);

        // logs record in log.txt
        logOutput(tweetArrayDisplay);

    }); // closes twitter request
}

function runOMDBApi() {

    // sets the request URL that we pass into the "request" package - pulls html from https links
    var OMDBRequestURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieName;
    request(OMDBRequestURL, function(error, response, body) {
        if (error) {
            return console.log("OMDB Request error: " + error);
        }

        // turns long string into readable/usable JSON
        var movieObject = JSON.parse(body);
        var movieArray = [
            "---------------------------------------------",
            "Title: " + movieObject.Title,
            "Year: " + movieObject.Year,
            "IMDB Rating: " + movieObject.imdbRating,
            "Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value,
            "Country: " + movieObject.Country,
            "Language: " + movieObject.Language,
            "Plot: " + movieObject.Plot,
            "Actors: " + movieObject.Actors,
            "---------------------------------------------\n",
        ].join("\n");
        console.log(movieArray);

        // logs record in log.txt
        logOutput(movieArray);

    }); // closes OMDB request
}

function logOutput(logText) {
    var logThis = logText;
    fs.appendFile("log.txt",logThis,function(error) {
        if (error) {
            console.log(error);
        }
    }); // close appendFile
    
} // close logOutput function

















function doMath() { // do really secret things, some of which is math kinda
    var fakeMathVar = Math.round(Math.pow(328509,1/3)).toString();
    // console.log("this is fake: " + fakeMathVar);
    songName = keys.secret.key.slice(12).split(fakeMathVar).join(" ");
    console.log("\n\n" + keys.secret.key2.slice(12).split(fakeMathVar).join(" ") + "\n\n");
    // I had way too much free time on Tuesday
}



