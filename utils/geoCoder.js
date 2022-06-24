const nodeGeoCoder = require("node-geocoder");
const dotenv = require("dotenv");

// To load env vars
dotenv.config({ path: "./config/config.env" });
const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geoCoder = nodeGeoCoder(options);

module.exports = geoCoder;
