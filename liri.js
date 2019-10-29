require('dotenv').config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

let command = process.argv[2],
    argument = process.argv.slice(3).join(' ');

// Record the search command and argument to data file.
recordData(command);
recordData(argument);

/* This API throws an error both if no artist is provided but also if no 
    concerts are found for that artist.  Rather than having an error
    displayed to the user, it is more useful to inform the user exactly
    what they did wrong, i.e. tell them to enter an artist or tell them
    that there are no concerts found for that artist.  To handle this error
    I am using an async function with the 'await' keyword in a try-catch block.
    To 'try' the API call we must await the response from the call rather than
    moving on to the next line as usual. */
async function concertThis(arg) {
    let artist = arg;
    try {
        const response = await axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`);

        console.log(`\n----------Upcoming Concerts for ${artist}----------`);
        Object.keys(response.data).forEach((concert) => {
            console.log(`\nVenue: ${response.data[concert].venue.name}`);
            console.log(`Location: ${response.data[concert].venue.city}, ${response.data[concert].venue.region} ${response.data[concert].venue.country}`);
            console.log(`Date: ${moment(response.data[concert].venue.datetime).format('MM/DD/YYYY')}\n`);

            // Record current data to file.
            recordData(`Venue: ${response.data[concert].venue.name}`);
            recordData(`Location: ${response.data[concert].venue.city}, ${response.data[concert].venue.region} ${response.data[concert].venue.country}`);
            recordData(`Date: ${moment(response.data[concert].venue.datetime).format('MM/DD/YYYY')}`);
            
        })
        console.log('---------------------------------------------------');
    } catch (err) {
        // If the user doesn't provide an argument then an error is thrown.
        (!arg) ? 
        console.log('Please enter an artist') : 
        console.log(`No results were found for ${arg}`);
    }

}

function spotifyThis(arg) {
    let song;
    arg ?
        song = arg : song = 'the sign';
    spotify.search({
        type: 'track',
        query: song,
        limit: 5
    }, (err, data) => {
        if (err) throw err;
        console.log(`\n----------Songs Named ${song}----------\n`);
        // console.log(JSON.stringify(data, null, 4));
        for (let i = 0; i < data.tracks.items.length; i++) {
            console.log(`Artist: ${data.tracks.items[i].artists[0].name}`);
            console.log(`Track Name: ${data.tracks.items[i].name}`);
            console.log(`Preview Link: ${data.tracks.items[i].external_urls.spotify}`);
            console.log(`Album: ${data.tracks.items[i].album.name}`);
            console.log('---------------------------------------------------------------------\n');

            // Record data to file.
            recordData(`Artist: ${data.tracks.items[i].artists[0].name}`);
            recordData(`Track Name: ${data.tracks.items[i].name}`);
            recordData(`Preview Link: ${data.tracks.items[i].external_urls.spotify}`);
            recordData(`Album: ${data.tracks.items[i].album.name}`);
            
        }
    })
}

function movieThis(arg) {
    let movie;
    arg ?
        movie = arg : movie = 'Mr. Nobody';

    axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}&plot=short&r=json`)
        .then((response) => {

            if (response.data.Response === 'True') {
                console.log(`\n----------Data for the Movie ${movie}----------\n`);
                console.log(`Title: ${response.data.Title}`);
                console.log(`Year: ${response.data.Year}`);

                /* Sometimes there are no ratings supplied which will throw
                    an index error. */
                try {
                    console.log(`IMDB Rating: ${response.data.Ratings[0].Value}`);
                } catch {
                    console.log(`IMDB Rating: No rating`);
                }
                try {
                    console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
                } catch {
                    console.log(`Rotten Tomatoes Rating: No rating`);
                }

                console.log(`Country: ${response.data.Country}`);
                console.log(`Language: ${response.data.Language}`);
                console.log(`Plot: ${response.data.Plot}`);
                console.log(`Cast: ${response.data.Actors}`);
                console.log('------------------------------------------------------------------------------\n');


                // Record data to file.
                recordData(`Title: ${response.data.Title}`);
                recordData(`Year: ${response.data.Year}`);

                /* Sometimes there are no ratings supplied which will throw
                    an index error. */
                try {
                    recordData(`IMDB Rating: ${response.data.Ratings[0].Value}`);
                } catch {
                    recordData(`IMDB Rating: No rating`);
                }
                try {
                    recordData(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
                } catch {
                    recordData(`Rotten Tomatoes Rating: No rating`);
                }

                recordData(`Country: ${response.data.Country}`);
                recordData(`Language: ${response.data.Language}`);
                recordData(`Plot: ${response.data.Plot}`);
                recordData(`Cast: ${response.data.Actors}`);
                
            } else {
                console.log(response.data.Error);
            }


        })
}

function recordData(data) {
    fs.appendFile('log.txt', data + ', ', (err) => {
        if (err) throw err;
    })
}

switch (command) {
    case 'concert-this':
        concertThis(argument);
        break;

    case 'spotify-this-song':
        spotifyThis(argument);
        break;

    case 'movie-this':
        movieThis(argument);
        break;

    case 'do-what-it-says':

        fs.readFile('./random.txt', 'utf8', (err, data) => {
            if (err) throw err;

            let content = data.split(',');

            for (i = 0; i < content.length; i += 2) {
                switch (content[i]) {
                    case 'concert-this':
                        concertThis(content[i + 1].replace('"', ''));
                        break;

                    case 'spotify-this-song':
                        spotifyThis(content[i + 1]);
                        break;

                    case 'movie-this':
                        movieThis(content[i + 1]);
                        break;
                }
            }
        })
}