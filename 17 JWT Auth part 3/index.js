const express = require('express');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pgp = require('pg-promise')();

dotenv.config();

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'your_database_name',
    user: 'your_username',
    password: 'your_password'
};

const db = pgp(dbConfig);

app.get('/api/users/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userId = req.user.id;

    try {
        await db.none('UPDATE users SET token = NULL WHERE id = $1', userId);
        res.json({ msg: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
});

const authorize = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

app.post('/api/planets/:id/image', authorize, upload.single('image'), async (req, res) => {

});


const app = express();
app.use(express.json());
app.use(passport.initialize());