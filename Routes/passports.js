import express from "express";
import passport from "passport";

const router = express.Router();

// Route to initiate Google OAuth authentication
router.get("/auth/google", (req, res, next) => {
   
    // Start Google OAuth authentication
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);

  }, (err, req, res, next) => {

    // Handle authentication error
    console.error(err);
    res.status(500).json({ error: "Authentication Error" });
  }
);

// Route to handle the callback from Google OAuth
router.get("/auth/google/callback", (req, res, next) => {
    
    // Authenticate with Google and handle failure
    passport.authenticate("google", { failureRedirect: "/" })(req, res, next);
    
  }, (err, req, res, next) => {
  
    // Handle authentication callback error
    console.error(err);
    res.status(500).json({ error: "Authentication Callback Error" });

  }, (req, res) => {
    
    // Successful authentication, redirect home or handle as needed
    res.redirect("/");

  }
);

// Route to access user details
router.get("/", (req, res) => {
  // Access user details through req.user
  res.send(req.user);
});

export const passportRouter = router;
