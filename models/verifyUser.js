import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const verifyUserSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
        },
        email :{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }
)

const VerifyUser = mongoose.model("verifyUser", verifyUserSchema);

const verifyToken=(email)=>{
    return jwt.sign({email},process.env.EMAIL_SECRET_KEY)
}
export { VerifyUser, verifyToken };
