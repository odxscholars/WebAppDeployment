const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.WEATHER_API_KEY;
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const base64Credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

const weatherToGenre = {
    "Clear": (feelsLike) => (feelsLike >= 25) ? "pop" : "classical",
    "Clouds": (feelsLike) => (feelsLike >= 20) ? "sad" : "piano",
    "Rain": (feelsLike) => (feelsLike >= 15) ? "classical" : "rainy-day",
    "Snow": (feelsLike) => (feelsLike <= 0) ? "holidays" : "jazz",
    "Thunderstorm": (feelsLike) => (feelsLike >= 25) ? "rock" : "classical",
    "Mist" : (feelsLike) => (feelsLike >= 15) ? "rock" : "acoustic",
};

const getWeatherData = async (cityName) => {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=metric`;
        console.log(url);
        const response = await axios.get(url);
        const data = response.data;
        console.log("data:", data.weather[0].main);
        const weatherData = {
            weather: data.weather[0].main,
            description: data.weather[0].description,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            temp_min: data.main.temp_min,
            temp_max: data.main.temp_max,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            visibility: data.visibility,
        };

        // Add the return statement to return the weatherData
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
};

async function getAccessToken() {
    const response = await axios.post(
        tokenEndpoint,
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    return response.data.access_token;
}

const getSpotifyMusic = async (weather, feelsLike) => {
    const accessToken = await getAccessToken();
    const genre = (typeof weatherToGenre[weather] === "function")
        ? weatherToGenre[weather](feelsLike)
        : weatherToGenre[weather];

    console.log(`chosen genre for ${weather}, ${feelsLike}: `, genre);
    console.log("access token: ", accessToken);

    const responsePayload = {
        url: `https://api.spotify.com/v1/search?q=genre:"${genre}"&type=track&limit=9`,
        header: {
            'Authorization': `Bearer ${accessToken}`,
        },
    };


    const response = await axios.get(responsePayload.url, { headers: responsePayload.header });
    console.log("response_status : ", response.status);
    console.log("response_data : ", response.data);
    return response;
};

const getTracks = async (req, res) => {
    const {cityName} = req.params; // Assuming cityName is passed as a query parameter
    console.log("cityName: ", cityName);
    try {
        const weatherData = await getWeatherData(cityName);
        const spotifyData = await getSpotifyMusic(weatherData.weather, weatherData.feels_like);
        const spotifyInfo = spotifyData.data.tracks.items;
        // You can modify this to send the data in the desired format
        res.status(200).json({
            weather: weatherData,
            spotifyInfo: spotifyInfo,
            // spotifyLink: spotifyInfo.external_urls.spotify,
            // spotifyName: spotifyInfo.name,
            // spotifyArtist: spotifyInfo.artists[0].name,
            // spotifyImage : spotifyInfo.album.images[1].url
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

// Call the main function
module.exports = {
    getTracks
};
