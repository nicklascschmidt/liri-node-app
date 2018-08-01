
require("dotenv").config();


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//   * `my-tweets`
//   * `spotify-this-song`
//   * `movie-this`
//   * `do-what-it-says`

// 1. `node liri.js my-tweets`
//    * This will show your last 20 tweets and when they were created at in your terminal/bash window.

// 2. `node liri.js spotify-this-song '<song name here>'`
//      * Artist(s)
//      * The song's name
//      * A preview link of the song from Spotify
//      * The album that the song is from
//    * If no song is provided then your program will default to "The Sign" by Ace of Base.

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

// 4. `node liri.js do-what-it-says`
//    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
//      * Feel free to change the text in that document to test out the feature for other commands.




