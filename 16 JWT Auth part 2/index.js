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

app.post('/api/users/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const newUser = await db.one(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, password]
        );

        res.json({ msg: 'Signup successful. Now you can log in.' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Failed to sign up' });
    }
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (password !== user.password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET);

        res.json({ token, id: user.id, username: user.username });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

const app = express();
app.use(express.json());
app.use(passport.initialize());