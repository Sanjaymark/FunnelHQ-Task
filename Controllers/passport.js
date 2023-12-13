// passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/users.js';

// Function to generate a random session secret
const generateSessionSecret = () => {
  return 'your-secret-key-' + Math.random().toString(36).substring(7);
};

const sessionSecret = generateSessionSecret();

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
},
(accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id }, (err, existingUser) => {
    if (err) {
      return done(err);
    }

    if (existingUser) {
      // If the user exists, return the user object
      return done(null, existingUser);
    }

    // If the user doesn't exist, create a new user in your local database
    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value, // Assuming email is part of the Google profile
      googleId: profile.id,
      // Add other relevant user information
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }

      // Return the newly created user object
      return done(null, newUser);
    });
  });
}));

passport.serializeUser((user, done) => {
  // Store only the user ID in the session
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Retrieve the full user object using the user ID
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export { sessionSecret };
