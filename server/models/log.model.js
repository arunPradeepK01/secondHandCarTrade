const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const logSchema = new Schema(
    {
        _id: {type: Schema.Types.ObjectId, auto: true},
        sellerId: {type: Schema.Types.ObjectId, required: true},
        buyerId: {type: Schema.Types.ObjectId, required: true},
        vin: {type: String, required: true},
        model: {type: String, required: true},
        price: {type: Number, required: true}
    },
    {
        versionKey: false
    }
);

const log = mongoose.model("logs", logSchema);

module.exports = log;