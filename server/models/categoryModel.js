const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
})
const categoryModel = mongoose.model('categories', categorySchema)
module.exports = categoryModel