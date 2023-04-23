// login - step 1
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    _id: {type: Schema.Types.ObjectId, auto: true},
    username: {type: String, required: true, unique: true, minlength: 3},
    password: {type: String, required: true, minlength: 3}
}, {
    timestamps: true
});

const user = mongoose.model("users", userSchema);

module.exports = user;