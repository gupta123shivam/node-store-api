const express = require("express");
const router = express.Router();

const {
  getAllProductsStatic,
  getAllProducts,
} = require("../controllers/productsController");

// Routes
router.route("/").get(getAllProducts);
router.route("/static").get(getAllProductsStatic);

// Exports
module.exports = router;