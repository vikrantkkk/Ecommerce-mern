const cloudinary = require("cloudinary");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDNARY_API_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary;
