const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJWT;
const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

const pool = new pg.Pool();

const jwtOptions = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new Strategy(jwtOptions, (payload, done) => {
  const { id } = payload;
  pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
    if (err) {
      return done(err, false);
    }

    const user = result.rows[0];

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

passport.use(strategy);

const app = express();

app.use(passport.initialize());

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;

pool.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Errore durante la creazione della tabella:', err);
  } else {
    console.log('Tabella "users" creata con successo!');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
