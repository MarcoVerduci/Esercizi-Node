const express = require('express');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
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

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};

passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', payload.sub);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

const app = express();
app.use(express.json());
app.use(passport.initialize());