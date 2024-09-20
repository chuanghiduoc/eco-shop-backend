const { createClient } = require('redis');

const client = createClient({ url: process.env.REDIS_URL });

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (error) => {
    console.error('Redis Client Error:', error);
});

client.connect().catch(err => console.error('Connection error:', err));

module.exports = client;