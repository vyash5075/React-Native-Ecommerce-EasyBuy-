const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    return res.status(500).json({ success: false });
  }
  return res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    return res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  return res.status(200).send(user);
});

router.post("/", async (req, res) => {
  bcrypt
    .hash(req.body.passwordHash, 12) //more bigger no more stronger password
    .then((hashedpassword) => {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: hashedpassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      });
      user
        .save()
        .then((user) => {
          res.status(200).json({ message: "saved successfully", user: user });
        })
        .catch((err) => {
          return res.status(400).send("the user cannot be created!");
          throw err;
        });
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  await User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.passwordHash)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(
            { userid: savedUser.id, isAdmin: savedUser.isAdmin },
            process.env.secret
          );
          const { _id, name, email } = savedUser;

          res.status(200).json({
            message: "Successfull",
            token: token,
            user: {
              _id,
              name,
              email,
            },
          });
        } else {
          return res.status(422).json({ error: "Invalid Email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments();

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});
module.exports = router;
