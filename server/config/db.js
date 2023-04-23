const mongoose = require("mongoose");

const mongoDB_Url = process.env.MongoDB_Url;

mongoose.connect(mongoDB_Url);

mongoose.connection.on("connected", () => {
    console.log("Connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.log(err);
});

// Start MongoDB server (mongod process)
// brew services start mongodb-community@6.0

// Stop MongoDB server
// brew services stop mongodb-community@6.0