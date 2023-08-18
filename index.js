import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {dbConnection} from "./db.js";
import {userRouter} from "./Routes/user.js"
import { isAuthenticated } from "./Authentication/auth.js";
import { CartRouter } from "./Routes/cart.js";
import { ProductRouter } from "./Routes/product.js";
import { OrderRouter } from "./Routes/order.js";


//configure env
dotenv.config();

//DB Connection
dbConnection();

const PORT = process.env.PORT;

//iniitalizing server
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/user", userRouter);
app.use("/products", ProductRouter);
app.use("/cart", isAuthenticated, CartRouter);
app.use("/order", isAuthenticated, OrderRouter);

//start Listening
app.listen(PORT, ()=>console.log(`server started in localhost:${PORT}`));