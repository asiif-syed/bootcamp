const BootcampModel = require("../models/Bootcamps");

// @desc    Get all bootcamps
// @router  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await BootcampModel.find();
    res
      .status(200)
      .send({ success: true, data: bootcamps, count: bootcamps.length });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc    Get a single bootcamp
// @router  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
      return res.status(400).send({ success: false });
    }
    res.status(200).send({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc    Get a new bootcamp
// @router  POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.create(req.body);
    res.status(201).send({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc    Update a single bootcamp
// @router  PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!bootcamp) {
      return res.status(400).send({ success: false });
    }
    res.status(201).send({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};

// @desc    Delete a single bootcamp
// @router  DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(400).send({ success: false });
    }
    res.status(201).send({ success: true, data: {} });
  } catch (err) {
    res.status(400).send({ success: false });
  }
};
