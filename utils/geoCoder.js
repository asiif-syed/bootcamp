import nodeGeoCoder from "node-geocoder";
import dotenv from "dotenv";

// To load env vars
dotenv.config({ path: "./config/config.env" });
const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

export const geoCoder = nodeGeoCoder(options);
