const Redis = require("ioredis");

const redis = new Redis(process.env.REDISH);

module.exports = redis;
