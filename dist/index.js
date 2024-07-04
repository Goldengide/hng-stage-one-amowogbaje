"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = '2ff975a9f3c741df893141450240407'; // Replace with your Weather API key
// Helper function to get location data from IP
// Helper function to get weather data
const getWeatherData = (ip) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${ip}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
});
app.get('/api/hello', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Get weather data
    const weatherData = yield getWeatherData(clientIp);
    if (!weatherData) {
        return res.status(500).json({ error: 'Unable to determine weather' });
    }
    let location = `${weatherData.location.name}, ${weatherData.location.country}`;
    const temperature = weatherData.current.temp_c;
    res.json({
        client_ip: clientIp,
        location,
        greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`
    });
}));
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
