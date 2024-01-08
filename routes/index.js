const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/user/register',async (req, res) => {
  const { username, password } = req.body;

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
module.exports = router;
