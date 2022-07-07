export const advancedResults = (model, populate) => async (req, res, next) => {
  // Copy Query
  const reqQuery = { ...req.query };
  // Fields to remove
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields to delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // Create string out of query
  let queryStr = JSON.stringify(reqQuery);

  // Create operators for MongoDB ($gt, $gte, $lt, $lte)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  let query = model.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalDocs = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  // Running query
  const results = await query;

  // pagination result
  const pagination = {};
  if (endIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};
