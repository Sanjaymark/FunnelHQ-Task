import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";
import { dbConnection } from "./db.js";
import { userRouter } from "./Routes/user.js";
import { isAuthenticated } from "./Authentication/auth.js";
import { CartRouter } from "./Routes/cart.js";
import { ProductRouter } from "./Routes/product.js";
import { OrderRouter } from "./Routes/order.js";
import { adminRouter } from "./Routes/admin.js";
import { passportRouter } from "./Routes/passports.js";


dotenv.config();

// DB Connection
dbConnection();

const PORT = process.env.PORT;
const app = express();

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));


app.use(express.json());


// Routes
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/products", ProductRouter);
app.use("/cart", isAuthenticated, CartRouter);
app.use("/order", OrderRouter);
app.use(passportRouter);

// Start Listening
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
