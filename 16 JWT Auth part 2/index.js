const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJWT;
const dotenv = require('dotenv');
const pg = require('pg');
const jwt = require('jsonwebtoken');

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

app.use(express.json());

app.use(passport.initialize());

app.post('/users/signup', (req, res) => {
  const { username, password } = req.body;
    
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while creating the user.' });
    }

    const userId = result.rows[0].id;
    return res.json({ msg: 'Signup successful. Now you can log in.' });
  });
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  pool.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while logging in.' });
    }

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.SECRET);

    pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while logging in.' });
      }

      return res.json({ token, id: user.id, username: user.username });
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
