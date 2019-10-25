require('dotenv').config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios');
const moment = require('moment');

let command = process.argv[2];

switch (command) {
    case 'concert-this':
        let artist = process.argv[3];
        axios.get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
            .then((response) => {
                console.log(`----------Upcoming Concerts for ${artist}----------`);
                Object.keys(response.data).forEach((concert) => {
                    console.log(`\nVenue: ${response.data[concert].venue.name}`);
                    console.log(`Location: ${response.data[concert].venue.city}, ${response.data[concert].venue.region} ${response.data[concert].venue.country}`);
                    console.log(`Date: ${moment(response.data[concert].venue.datetime).format('MM/DD/YYYY')}\n`);
                })
                console.log('---------------------------------------------------')
            })
        break;
    case 'spotify-this-song':
        let song;
        if (process.argv[3]) {
            song = process.argv.slice(3).join(' ');
        } else {
            song = 'the sign';
        }
        spotify.search({
            type: 'track',
            query: song,
            limit: 5
        }, (err, data) => {
            if (err) {
                console.log(`An Error Occurred: ${err}`);
            } else {
                console.log(`----------Songs Found Named ${song}----------\n`);
                // console.log(JSON.stringify(data, null, 4));
                for (let i = 0; i < data.tracks.items.length; i++) {
                    console.log(`Artist: ${data.tracks.items[i].artists[0].name}`);
                    console.log(`Track Name: ${data.tracks.items[i].name}`);
                    console.log(`Preview Link: ${data.tracks.items[i].external_urls.spotify}`);
                    console.log(`Album: ${data.tracks.items[i].album.name}`);
                    console.log('---------------------------------------------------------------------\n');
                }
            }
        })
        break;
    case 'movie-this':
        let movie;
        if (process.argv[3]) {
            movie = process.argv.slice(3).join(' ');
        } else {
            movie = 'Mr. Nobody';
        }
        axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}&plot=short&r=json`)
        .then((response) => {
            console.log(`----------`)
        })



}