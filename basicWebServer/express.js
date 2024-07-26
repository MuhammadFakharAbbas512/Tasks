const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const app = express();


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
    });
// to get all products
app.get('/product', async(req, res) => {
    //res.send('This is my first product');
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});
// to get product by id 
app.get('/product/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id); //Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});

/* // This is the code for the post request. 
app.post('/product', (req, res) => {
    console.log(req.body);
    res.send(req.body);
    });   */
app.post('/product', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }})

    // to update the product
app.put('/product/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        // if we cannot find the product
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const updatedProduct = await Product.findById(id);        
        res.status(200).json(updatedProduct);
    } catch (err) { 
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }   });

 // to delete the product
 
app.delete('/product/:id', async(req, res) => { 
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        // if we cannot find the product
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
});


mongoose.connect('mongodb+srv://fakharraza51214:admin12345@restapi.kjwb7sg.mongodb.net/?retryWrites=true&w=majority&appName=RESTAPI'
)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server running at http://localhost:3000/');
        });
    }
).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});