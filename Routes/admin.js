import express, { response } from "express";
import bcrypt from "bcrypt";
;
import { Admin, generateToken } from "../models/admin.js";

const router = express.Router();

// Signup a user to the website
router.post("/signup", async (req, res) => {
    try {
        // Find if the user is already registered
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            return res.status(400).send({ error: "Email Already Exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Add the user to the database
        admin = await new Admin({ ...req.body, password: hashedPassword }).save();


        // Generate a token and give it as a response
        const token = generateToken(admin._id);
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
        const admin = await Admin.findOne({ email: req.body.email});
        if(!admin)
        {
            return res.status(404).send({error: "Invalid email or Password"});
        }

        //validate the password
        const validatePassword = await bcrypt.compare(
            req.body.password,
            admin.password
        );

        if(!validatePassword)
        {
            return res.status(400).send({error:"Invalid Email or Password"});
        }

        //generate a token and give it as a response
        const token = generateToken(admin._id);
        res.status(200).send({ message:"Successfully Logged in", token});
    }
    catch(error)
    {
        //error handling
        console.log(error);
        res.status(500).send({ error:"Internal Server Error"});
    }
})



export const adminRouter = router;