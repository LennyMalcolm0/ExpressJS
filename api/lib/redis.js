const Redis = require('ioredis');

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

client.on("error", (err) => console.log(err))
client.on("connect", () => console.log("redis"))

module.exports = { client }