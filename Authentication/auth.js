import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const isAuthenticated = async (req,res, next) =>{
    let token;

    if(req.headers){
        try{
            token = await req.headers["x-auth-token"];
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            console.log("decode:", decode);
            req.user = await User.findById(decode.id).select("-password");
            next();
        }
        catch(error){
            console.log(error);
            res.status(400).send({ error: "Invalid Authentication"});
        }
    }

    if(!token){
        return res.status(400).send({ message: "Access Denied"});
    }
}