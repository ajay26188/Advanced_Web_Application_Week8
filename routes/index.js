const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const User = require('../models/User');
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

router.use(passport.initialize());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};

passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    User.findOne({username: jwtPayload.username}, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if  (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  })
)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Task 1 & Task 4

router.post('/api/user/register',
  [
    body('username').isEmail(),
    body('password')
      .isLength({min: 8})
      .matches(/[a-z]/)
      .matches(/[A-Z]/)
      .matches(/\d/)
      .matches(/[~`!@#$%^&*()-_+={}[\]|\;:"<>,./?]/)
  ],  
  async (req, res) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({errors: errors.array()});
    }

    User.findOne({ username })
      .then(existingUser => {
        if (existingUser) {
          return res.status(403).json({ email: 'Email already in use.'})
        }

        const newUser = new User({username, password});
        return newUser.save();
      })
      .then(() => res.status(201).json('ok'))

})

//Task 2

router.post('/api/user/login', async (req, res) => {
  const {username, password} = req.body;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(403).json({ message: 'Invalid username or password!'})
      }
      return bcrypt.compare(password, user.password).then(isMatch => ({user, isMatch}));
    })
    .then(({user, isMatch}) => {
      if (isMatch) {
        const jwtPayload = {
          username: user.username
        };

        const token = jwt.sign(jwtPayload, process.env.SECRET, {
          expiresIn: 120
        });
        res.json({success: true, token});
      } else {
        res.status(403).json({message: 'Invalid username or password!'})
      }
    })
})

//Task 3

router.get('/api/private',passport.authenticate('jwt', {session: false}),(req,res) => {
  res.json({email: req.user.username});
});

//Task 5



module.exports = router;
