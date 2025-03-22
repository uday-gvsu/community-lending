var express = require('express');
var router = express.Router();
var User = require('../db/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Community Lending App' });
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = new User({ firstName, lastName, email, password });
    console.log(newUser)

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
});

router.post("/login", async function(req, res){
  try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        console.log(req.body.password, user.password)
        const result = req.body.password === user.password;
        if (result) {
          res.status(201).json({ message: 'User logged in successfully' });
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});

module.exports = router;
