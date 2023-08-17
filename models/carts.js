import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    Price:{
        type: Number,
        default: 0,
    }
});

// Calculate the Price based on product price and quantity
cartItemSchema.pre('save', async function (next) {
    if (this.product) {
        const product = await mongoose.model('Product').findById(this.product);
        this.Price = product.price * this.quantity;
    }
    next();
});


const CartItem = mongoose.model('CartItem', cartItemSchema);

const cartSchema = new mongoose.Schema({
    items: [cartItemSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0
    }
});

// Calculate and update the total price of the cart
cartSchema.methods.calculateTotalPrice = function () {
    this.totalPrice = this.items.reduce(
        (total, item) => total + item.Price,
        0
    );
};

// Pre-save hook to calculate the total price before saving
cartSchema.pre('save', function (next) {
    this.calculateTotalPrice();
    next();
});


const Cart = mongoose.model('Cart', cartSchema);

export { Cart, CartItem };
