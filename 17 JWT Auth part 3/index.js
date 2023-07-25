const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJWT;
const dotenv = require('dotenv');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const multer = require('multer');

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

const authorize = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while processing the request.' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage });

app.get('/users/logout', authorize, (req, res) => {
  const userId = req.user.id;

  pool.query('UPDATE users SET token = NULL WHERE id = $1', [userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while logging out.' });
    }

    return res.json({ msg: 'Logout successful.' });
  });
});

app.get('/protected', authorize, (req, res) => {
  return res.json({ msg: 'You have access to this protected route.' });
});

app.post('/upload', authorize, upload.single('image'), (req, res) => {
  return res.json({ msg: 'File uploaded successfully.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
