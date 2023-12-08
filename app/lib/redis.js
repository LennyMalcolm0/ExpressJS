const Redis = require('redis');

const client = Redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on("error", (err) => console.log(err))
client.on("connect", () => console.log("redis"))

if (!client.isOpen) {
    client.connect()
}

module.exports = { client }