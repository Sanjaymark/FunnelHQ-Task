import express, { response } from "express";
import { User, generateToken } from "../models/users.js";
import bcrypt from "bcrypt";
import { Cart } from "../models/carts.js";

const router = express.Router();

// Signup a user to the website
router.post("/signup", async (req, res) => {
    try {
        // Find if the user is already registered
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send({ error: "Email Already Exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Add the user to the database
        user = await new User({ ...req.body, password: hashedPassword }).save();

        // Create a new cart for the user
        const cart = await Cart.create({ user: user._id });

        // Generate a token and give it as a response
        const token = generateToken(user._id);
        res.status(201).send({ message: "Successfully Created", token });
    } catch (error) {
        // Error handling
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// login a user to the website

router.post("/login", async (req, res) =>{
    try{
        //find the user exist
        const user = await User.findOne({ email: req.body.email});
        if(!user)
        {
            return res.status(404).send({error: "Invalid email or Password"});
        }

        //validate the password
        const validatePassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if(!validatePassword)
        {
            return res.status(400).send({error:"Invalid Email or Password"});
        }

        //generate a token and give it as a response
        const token = generateToken(user._id);
        res.status(200).send({ message:"Successfully Logged in", token});
    }
    catch(error)
    {
        //error handling
        console.log(error);
        res.status(500).send({ error:"Internal Server Error"});
    }
})


// Get all users
router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export const userRouter = router;