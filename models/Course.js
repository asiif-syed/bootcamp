import mongoose from "mongoose";

const CourseSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required."],
  },
  description: {
    type: String,
    required: [true, "Course desciption is required."],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks."],
  },
  tuition: {
    type: Number,
    required: [true, "Please add tuition cost."],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill level required."],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamps",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamps",
  },
});

// Static method to calculate avg cost for a course
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await this.model("Bootcamps").findByIdAndUpdate(bootcampId, {
      averageCost: obj[0].averageCost,
    });
  } catch (error) {
    console.log("🚀 ~ file: Course.js ~ line 57 ~ error", error);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre("remove", function (next) {
  this.constructor.getAverageCost(this.bootcamp);
  next();
});

export const CourseModel = mongoose.model("Courses", CourseSchema);
