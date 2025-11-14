// proxy-server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Proxy endpoint for Google Places API
app.get('/api/google/places', async (req, res) => {
    try {
        const { query, apiKey } = req.query;
        
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
            `input=${encodeURIComponent(query)}&` +
            `inputtype=textquery&` +
            `fields=place_id,name,formatted_address,rating,user_ratings_total&` +
            `key=${apiKey}`
        );
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy server error' });
    }
});

// Proxy endpoint for Place Details (reviews)
app.get('/api/google/place-details', async (req, res) => {
    try {
        const { placeId, apiKey } = req.query;
        
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?` +
            `place_id=${placeId}&` +
            `fields=name,rating,user_ratings_total,reviews,formatted_address&` +
            `key=${apiKey}`
        );
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log('Make sure your API key has no restrictions for testing');
});