const express = require("express");
const router = express.Router();

const { AddProduct, AddMobiles } = require("../controllers/adminController");

router.route("/products").get(AddProduct);
router.route("/mobiles").get(AddMobiles);

module.exports = router;
