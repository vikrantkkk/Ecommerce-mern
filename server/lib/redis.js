const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDISH);

module.exports = redis;
