import express from 'express';
import { Request, Response } from 'express';
import { lookup } from 'geoip-lite';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API! Use /api/hello?visitor_name=YourName to get a personalized greeting.');
});

// API route
app.get('/api/hello', async (req: Request, res: Response) => {
    const visitorName = req.query.visitor_name as string || 'Visitor';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = lookup(clientIp as string);

    let city = 'unknown location';
    if (location && location.city) {
        city = location.city;
    }

    let temperature = 'unknown';
    if (city !== 'unknown location') {
        try {
            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city,
                    appid: 'your_openweathermap_api_key',
                    units: 'metric'
                }
            });
            temperature = `${weatherResponse.data.main.temp} degrees Celsius`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    res.json({
        client_ip: clientIp,
        location: city,
        greeting: `Hello, ${visitorName}! The temperature is ${temperature} in ${city}.`
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
