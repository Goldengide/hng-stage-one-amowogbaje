import express from 'express';
import axios from 'axios';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 3000;




const getWeatherData = async (ip:any) => {
    
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${ip}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
 

  // Get weather data
  const weatherData = await getWeatherData(clientIp);

  if (!weatherData) {
    return res.status(500).json({ error: 'Unable to determine weather' });
  }
  let location = `${weatherData.location.name}, ${weatherData.location.country}`

  const temperature = weatherData.current.temp_c;

  res.json({
    client_ip: clientIp,
    location,
    greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
