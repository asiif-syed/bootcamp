const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const BootcampModel = require("./models/Bootcamps");

// To load env vars
dotenv.config({ path: "./config/config.env" });

// DB Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI);
}

// Read JSON Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Import into DB
const importsData = async () => {
  try {
    await BootcampModel.create(bootcamps);
    console.log("Data imported");
  } catch (err) {
    console.log("%seeder.js line:22 err", "color: #007acc;", err);
  }
};
// Delete Data
const deleteData = async () => {
  try {
    await BootcampModel.deleteMany();
    console.log("Data is deleted");
  } catch (err) {
    console.log("%seeder.js line:22 err", "color: #007acc;", err);
  }
};

if (process.argv[2] === "1") {
  importsData();
} else if (process.argv[2] === "0") {
  deleteData();
}
