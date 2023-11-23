const axios = require('axios');

const clientId = '52914bff3cf94049b99d4f5e6e84ad3d';
const clientSecret = '5e4817c48b3c4225ae5290192a6de7a7';

// Encode your client ID and client secret as base64
const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Spotify API endpoint for obtaining an access token
const tokenEndpoint = 'https://accounts.spotify.com/api/token';

// Spotify API endpoint for getting a track by ID
const artistEndpoint = 'https://api.spotify.com/v1/artists/';

// Example function to get an access token
async function getAccessToken() {
    const response = await axios.post(
        tokenEndpoint,
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    console.log(response)
    console.log("access token: ", response.data.access_token)
    return response.data.access_token;
}

// Example function to get information about a track by ID
async function getTrackById(trackId) {
    const accessToken = await getAccessToken();
    //construct response first
    const responsePayload = {
        url: 'https://api.spotify.com/v1/search?q=genre:"classical"&type=track&limit=1',
        header: {
            'Authorization': `Bearer ${accessToken}`
        }
    }


    const response = await axios.get(responsePayload.url, { headers: responsePayload.header })


    return response
}

// Example: Get information about a track by ID
getTrackById('2VvA2aM9WDb38IjGp6a4y8')
    .then(trackInfo => {
        console.log('Artist Information:', trackInfo.data);
        //print each object in the albums.items array
        console.log("logging items")
        trackInfo.data.tracks.items.forEach((item) => {
            console.log(item, item.external_urls.spotify)
        })

    })
    .catch(error => {
        console.error('Error fetching track information:', error.message);
    });
