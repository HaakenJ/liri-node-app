# liri-node-app

## Overview
A Node.js console app to search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

## Usage
  Users enter one of four commands into the console:
    - concert-this
    - spotify-this-song
    - movie-this
    - do-what-it-says

  After the first three commands the user also enters an argument.  This argument is either a band, a song,
 and a movie, respectively.  The 'do-what-it-says' command will run whatever commands and arguments have 
 been saved in the .txt file random.txt.

  Each command, argument, and resulting data is stored in the file log.txt.

## Screenshots of App in Action

<a href="https://imgur.com/a/7EstrSe">Link to Screenshots</a>

## Technologies

App is coded entirely in JavaScript for Node.js.

Modules:
    - Dotenv
    - Node-spotify-api
    - Axios
    - Moment.js
    - fs

All modules are included in dependencies and will be installed with node install.

A user will need to provide their own Spotify API keys in their on .env variable.