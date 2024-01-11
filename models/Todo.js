const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

let todoSchema = new Schema ({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    items: {type: [String]},
});

module.exports = mongoose.model("Todo", todoSchema);