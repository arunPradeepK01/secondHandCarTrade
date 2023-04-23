const express = require("express");

const router = express.Router();

router.use("/car", require("../controllers/car.controller"));

module.exports = router;