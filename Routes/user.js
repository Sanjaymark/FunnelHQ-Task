import express, { response } from "express";
import { User, generateToken } from "../models/users.js";
import { verifyToken } from "../models/verifyUser.js";
import bcrypt from "bcryptjs"
import { Cart } from "../models/carts.js";
import { VerifyUser } from "../models/verifyUser.js";
import { sendEmail } from "../Controllers/mail.js";

const router = express.Router();

// Signup a user to the website by sending verification link to user email
router.post("/signup", async (req, res) => {
    try {
        // Find if the user is already registered
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send({ error: "Email Already Exists" });
        }

        const email = req.body.email;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Generate a token
        const token = verifyToken(email);

        const verifyuser =new VerifyUser({ ...req.body, password: hashedPassword, token:token});

        const activationLink = `http://localhost:8080/user/signup/${token}`;

        const content = `<h4>Hi</h4>, <h2>Welcome to Sanjay's E-commerce App</h2>
        <h3>Please Click the link below to complete your Registration</h3>
        <a href="${activationLink}" target="_blank">Click here</a>
        <p>Thanks</p>
        <p>Sanjay</p>`

        await verifyuser.save();

        const subject = "Verify User";
        
        sendEmail(email, subject, content)

        res.status(201).send({ message: "Email sent Successfully", token});
    } catch (error) {
        // Error handling
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


// verifying the signup of user
router.get("/signup/:token", async(req, res)=>{
    try {

        const token = req.params.token;
        const verifiedUser = await VerifyUser.findOne({token:token})

        if(verifiedUser){
            const user = await new User({
                name: verifiedUser.name,
                email: verifiedUser.email,
                password: verifiedUser.password
            }).save();

            await VerifyUser.deleteOne({token:token});

            const cart = await Cart.create({ user: user._id });
            
            const content = `<h3>Registration Successful</h3>
            <p>Regards</p>
            <p>Sanjay</p>`;

            res.send(`<h2>You are Registered Successfully</h2>`);
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
})


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