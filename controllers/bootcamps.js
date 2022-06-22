// @desc    Get all bootcamps
// @router  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).send({ success: true, message: `Get all bootcamps` });
};

// @desc    Get a single bootcamp
// @router  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, message: `Get bootcamp ${req.params.id}` });
};

// @desc    Get a new bootcamp
// @router  POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).send({ success: true, message: `Create new bootcamp` });
};

// @desc    Update a single bootcamp
// @router  PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, message: `Update bootcamp ${req.params.id}` });
};

// @desc    Delete a single bootcamp
// @router  DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .send({ success: true, message: `Delete bootcamp ${req.params.id}` });
};
