import express, { Request, Response } from 'express';
import axios from 'axios';
import geoip from 'geoip-lite';

const app = express();

app.get('/api/hello', async (req: Request, res: Response) => {
    const visitorName = req.query.visitor_name as string || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Get location data
    const geo = geoip.lookup(clientIp as string);
    const location = geo ? geo.city : 'Unknown';

    // Get temperature data
    const weatherApiKey = '247e7341e846c35a976a868d00ad47ec'; // Replace with your weather API key
    let temperature = 'Unknown';
    if (location !== 'Unknown') {
        try {
            const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}`);
            temperature = weatherResponse.data.current.temp_c;
        } catch (error) {
            console.error(error);
        }
    }

    res.json({
        client_ip: clientIp,
        location: location,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
