const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"]
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema); // this is our model for data

module.exports = Product; // this is our module for data