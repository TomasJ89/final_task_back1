const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },

    conversations: {
        type: Array,
        required: true,
        default: []
    },
    notifications: {
        type: Array,
        required: true,
        default: []
    }

});
const user = mongoose.model("users", userSchema);

module.exports = user;