import express from "express";
import { Product } from "../models/products.js";


const router = express.Router();


// Create a new product
router.post('/add', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all products
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a product by ID
router.put('/edit/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a product by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: "Deleted Successfully"});
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category });
        
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category' });
        }
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export const ProductRouter = router;