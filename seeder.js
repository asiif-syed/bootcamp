import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import { BootcampModel } from "./models/Bootcamps";
import { CourseModel } from "./models/Course";
import { UserModel } from "./models/User";
import path from "path";
import { fileURLToPath } from "url";
// To load env vars
dotenv.config({ path: "./config/config.env" });

// DB Connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI);
}

// Read JSON Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importsData = async () => {
  try {
    await BootcampModel.create(bootcamps);
    await CourseModel.create(courses);
    await UserModel.create(users);
    console.log("Data imported");
  } catch (err) {
    console.log("%seeder.js line:22 err", "color: #007acc;", err);
  }
};
// Delete Data
const deleteData = async () => {
  try {
    await BootcampModel.deleteMany();
    await CourseModel.deleteMany();
    await UserModel.deleteMany();
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
