const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carSchema = new Schema(
    {
        _id: {type: Schema.Types.ObjectId, auto: true},
        // auth
        ownerId: {type: Schema.Types.ObjectId, required: true},
        // vin
        vin: {type: String, required: true},
        model: {type: String, required: true},
        price: {type: Number, required: true},
        owner: {type: String, required: true},
        description: {type: String}
    },
    {
        versionKey: false
    }
);

const car = mongoose.model("cars", carSchema);

module.exports = car;