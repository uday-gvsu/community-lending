var express = require('express');
var router = express.Router();
var User = require('../db/user');
var Item = require('../db/item');
var Order = require('../db/order');

var mongoose = require('mongoose')

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
    res.status(201).json({ message: 'User registered successfully' , id : newUser.id});
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
          res.status(201).json({ message: 'User logged in successfully', id: user.id });
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

router.post('/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/items", async function(req, res){
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/items/orders", async function(req, res){
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/items/orders", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          borrowerId: new mongoose.Types.ObjectId(req.query.id), // Match orders for current user
        },
      },
      {
        $addFields: {
          itemId: { $toObjectId: "$itemId" }, // Convert string to ObjectId
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "itemId",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $unwind: "$itemDetails",
      },
      {
        $unwind: "$ownerDetails",
      },
      {
        $project: {
          _id: 1,
          itemId: 1,
          borrowerId: 1,
          itemName: "$itemDetails.name",
          itemDescription: "$itemDetails.description",
          itemPrice: "$itemDetails.price",
          ownerName: "$ownerDetails.firstName",
          ownerEmail: "$ownerDetails.email",
          borrowedAt: 1,
          numberOfDays: 1,
          price: 1,
          rating: 1,
        },
      },
    ]);

    console.log(orders.length)

    if (!orders.length) {
      return res.status(404).send({ message: "No orders found for this user." });
    }

    res.status(200).send(orders);
  } catch (error) {
    console.error("❗️ Error fetching orders:", error);
    res.status(500).send({ error: "Error fetching orders. Try again later." });
  }
}

);

module.exports = router;
