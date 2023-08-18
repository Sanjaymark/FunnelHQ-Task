import express from "express";
import { Product } from "../models/products.js";
import { Cart, CartItem } from "../models/carts.js";

const router = express.Router();




// Get cart by user ID
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Add an item to the logged-in user's cart
router.post('/add/:productId', async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware
        const productId   = req.params.productId;
        const Quantity = req.body.quantity;

        console.log("UserId:", loggedInUserId);

        const addedProduct = await Product.findById({ _id : productId});


        if (!addedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const newItem = await CartItem.create({ product: productId, quantity: Quantity });


        let loggedInUserCart = await Cart.findOne({ user: loggedInUserId });

        console.log("UserCart:", loggedInUserCart)
        if (!loggedInUserCart) {
            loggedInUserCart = await Cart.create({ user: loggedInUserId, items: [newItem] });
        } else {
            loggedInUserCart.items.push(newItem);
        }

        await loggedInUserCart.save();

        res.status(201).json({ message: "Item added to cart successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



// Delete an item from the logged-in user's cart
router.delete('/delete/:itemId', async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware
        const itemId = req.params.itemId;

        let loggedInUserCart = await Cart.findOne({ user: loggedInUserId });
        if (!loggedInUserCart) {
            return res.status(404).json({ message: "User's cart not found" });
        }

        const itemToDeleteIndex = loggedInUserCart.items.findIndex(item => item._id.toString() === itemId);
        if (itemToDeleteIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        loggedInUserCart.items.splice(itemToDeleteIndex, 1);

        await loggedInUserCart.save();

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get the logged-in user's cart
router.get('/user/my-cart', async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware

        const loggedInUserCart = await Cart.findOne({ user: loggedInUserId })
            .populate('items.product');

        if (!loggedInUserCart) {
            return res.status(404).json({ message: "User's cart not found" });
        }

        res.status(200).json(loggedInUserCart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export const CartRouter = router;