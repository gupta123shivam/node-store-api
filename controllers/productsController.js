const Product = require("../models/Product");

const getAllProductsStatic = async (req, res) => {
  // Caught by express-async-errors
  // throw new Error("testing new package");

  const allProducts = await Product.find({})
    .sort({ name: 1 }) // .sort("-name -price")
    // .select({ _id: 0, name: 1, price: 1 })
    // .skip(2 * 1 + 1)
    // .limit(1)
    .exec(); // rating: {$lt : 4.6}

  if (!allProducts) {
    throw new Error("Didnt find Products in Database");
  }

  res
    .status(200)
    .json({ success: true, nbHits: allProducts.length, data: allProducts });
};

// /api/v1/products?name=john&featured=true&company=ikea&sort=-name, price&fields=name,price&limit=10&page=1&numericFilters=price>80,rating>=4.55
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  const companies = ["ikea", "liddy", "caressa", "marcos"];
  if (companies.includes(company)) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|<=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject); // rating: {$lt : 4.6}

  // Sorting   // .select({ _id: 0, name: 1, price: 1 })
  if (sort) {
    const newSort = sort
      .split(",")
      .map((item) => item.trim())
      .join(" ");
    result = result.sort(newSort);
  } else {
    result = result.sort("createdAt");
  }

  // Getting only described fields
  if (fields) {
    const selectFields = fields
      .split(",")
      .map((item) => item.trim())
      .join(" ");
    result = result.select(selectFields);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Skipping
  result = result.skip(skip).limit(limit);

  const allProducts = await result.exec();
  if (!allProducts) {
    throw new Error("Didnt find Products in Database");
  }

  res
    .status(200)
    .json({ success: true, nbHits: allProducts.length, data: allProducts });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
