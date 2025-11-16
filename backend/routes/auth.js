import express from 'express';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../Models/user.js';

const router = express.Router();

// Environment-configured values
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 2824}`;

// Passport Facebook strategy
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: `${BACKEND_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const name = profile.displayName || 'Facebook User';
        // find or create user
        let user = null;
        if (email) user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email: email || `fb_${profile.id}@noemail.local`, password: '' });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Begin Facebook auth
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
    router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

    // Callback
    router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${FRONTEND_URL}/auth/failure` }), (req, res) => {
        // Successful auth. Redirect back to frontend with user payload encoded in query.
        try {
            const user = req.user;
            const safe = encodeURIComponent(JSON.stringify({ id: user._id, name: user.name, email: user.email }));
            res.redirect(`${FRONTEND_URL}/auth/success?user=${safe}`);
        } catch (e) {
            res.redirect(`${FRONTEND_URL}/auth/failure`);
        }
    });
} else {
    // graceful fallback when FB OAuth isn't configured
    router.get('/facebook', (req, res) => {
        res.status(501).json({ error: 'Facebook OAuth not configured on server' });
    });
    router.get('/facebook/callback', (req, res) => {
        res.status(501).send('Facebook OAuth not configured on server');
    });
}

export default router;
