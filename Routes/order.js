import express from "express";
import { Order } from "../models/orders.js"; // Assuming you have the appropriate models
import { Cart } from "../models/carts.js";
import { isAdmin, isAuthenticated } from "../Authentication/auth.js";

const router = express.Router();



// Place an order for a single product for the logged-in user
router.post('/place-order/:cartId', isAuthenticated, async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware
        const cartId = req.params.cartId;

        // Find the user's cart and populate the items
        const userCart = await Cart.findOne({ user: loggedInUserId }).populate('items.product');
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the selected cart item for the specified product
        const selectedCartItem = userCart.items.find(item => item._id.toString() === cartId);
        if (!selectedCartItem) {
            return res.status(404).json({ message: "Selected product not found in cart" });
        }

        // Calculate the total amount of the selected product
        const totalAmount = selectedCartItem.Price;

        // Create a new order for the selected product
        const newOrderItem = {
            product: selectedCartItem.product,
            quantity: selectedCartItem.quantity
        };

        // Create the order and add it to the user's orders array
        const newOrder = await Order.create({
            cart: userCart._id, // Assign the user's cart to the order's cart field
            user: loggedInUserId,
            items: [newOrderItem],
            totalAmount
            // Add other fields as needed
        });

        // Remove the selected product's cart item from the user's cart
        userCart.items = userCart.items.filter(item => item._id.toString() !== cartId);
        await userCart.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/my-orders', isAuthenticated, async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware

        console.log(loggedInUserId)
        // Find all orders for the logged-in user
        const userOrders = await Order.find({ user: loggedInUserId })
            .populate('items.product') // Populate the product field in items
            .sort({ orderDate: -1 });

        res.status(200).json(userOrders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});







// Update order status by order ID
router.patch('/update-status/:orderId',isAdmin, async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware
        const orderId = req.params.orderId;
        const newStatus = req.body.status;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to update this order' });
        }

        order.status = newStatus;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', updatedOrder: order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});





export const OrderRouter = router;
