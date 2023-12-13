import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./db.js";
import { userRouter } from "./Routes/user.js";
import { isAuthenticated } from "./Authentication/auth.js";
import { CartRouter } from "./Routes/cart.js";
import { ProductRouter } from "./Routes/product.js";
import { OrderRouter } from "./Routes/order.js";
import { adminRouter } from "./Routes/admin.js";
import passport from 'passport';
import session from "express-session"; // Import session here
import { passportRouter } from "./Routes/passports.js";
import { sessionSecret } from "./Controllers/passport.js";


// Configure env
dotenv.config();

// DB Connection
dbConnection();

const PORT = process.env.PORT;

// Initialize server
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Use session middleware
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  }));



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/products", ProductRouter);
app.use("/cart", isAuthenticated, CartRouter);
app.use("/order", OrderRouter);

// Use passportRouter
app.use(passportRouter);

// Start Listening
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
