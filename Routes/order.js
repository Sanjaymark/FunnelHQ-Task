import express from "express";
import { UserOrder, Order } from "../models/orders.js"; // Assuming you have the appropriate models
import { Cart } from "../models/carts.js";

const router = express.Router();



// Place an order for a single product for the logged-in user
router.post('/place-order/:productId', async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware
        const productId = req.params.productId;

        // Find the user's cart and populate the items
        const userCart = await Cart.findOne({ user: loggedInUserId }).populate('items.product');
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the selected cart item for the specified product
        const selectedCartItem = userCart.items.find(item => item.product._id.toString() === productId);
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
        userCart.items = userCart.items.filter(item => item.product._id.toString() !== productId);
        await userCart.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get all orders for the logged-in user
router.get('/my-orders', async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get user ID from the authenticated middleware

        // Find all orders for the logged-in user
        const userOrders = await Order.find({ user: loggedInUserId })
            .sort({ orderDate: -1 }); // Sort orders by orderDate in descending order

        const populatedOrders = await Promise.all(userOrders.map(async (order) => {
            const populatedItems = await Promise.all(order.items.map(async (item) => {
                const populatedProduct = await item.product.populate('product').execPopulate();
                return {
                    product: populatedProduct,
                    quantity: item.quantity,
                    Price: item.Price
                };
            }));

            return {
                _id: order._id,
                cart: order.cart,
                user: order.user,
                totalAmount: order.totalAmount,
                orderDate: order.orderDate,
                status: order.status,
                items: populatedItems
            };
        }));

        res.status(200).json(populatedOrders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});






// Update order status by order ID
router.patch('/update-status/:orderId', async (req, res) => {
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
