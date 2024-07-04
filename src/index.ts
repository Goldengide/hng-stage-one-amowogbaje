import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.ip;

  try {
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const location = locationResponse.data.city;
    const temperature = 11; // Replace with actual temperature retrieval logic

    res.json({
      client_ip: clientIp,
      location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`,
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the API server!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
