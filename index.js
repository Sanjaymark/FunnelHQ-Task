// index.js
import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import connectMongo from "connect-mongo";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./db.js";
import { userRouter } from "./Routes/user.js";
import { isAuthenticated } from "./Authentication/auth.js";
import { CartRouter } from "./Routes/cart.js";
import { ProductRouter } from "./Routes/product.js";
import { OrderRouter } from "./Routes/order.js";
import { adminRouter } from "./Routes/admin.js";
import { passportRouter } from "./Routes/passports.js";
import { sessionSecret } from "./Controllers/passport.js";

dotenv.config();

// DB Connection
dbConnection();

const PORT = process.env.PORT;
const app = express();

// Set up MongoDB session store with connect-mongo
const MongoStore = connectMongo(session);

// Middlewares
app.use(cors());
app.use(express.json());

// Session middleware with MongoDB store
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
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
app.use(passportRouter);

// Start Listening
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
