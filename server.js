const express = require("express");
const apiRoutes = require("./server/routes/api.routes");
const ejs = require("ejs");

//setup environment settings
require("dotenv").config();

//database
require("./server/config/db");

const app = express();

app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.use("/api", apiRoutes);

// JSON parsing
app.use(express.json());

const port  = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running at port: http://localhost:${port}`);
});