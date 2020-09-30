const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models/User");
const { sendEMail } = require("../utils/email");
const { upload } = require('../utils/upload');
const { retrievePW, verifyEmail } = require("../utils/redis");
const { checkPassword } = require("../utils/passwordChecker");



// Get Current User
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {


    const user = await User.findById(req.user.id)
      .populate("servers")
      .select("-password");

    return res.status(200).json(user);
  }
);

// Get Current User
router.get(
  "/:id",
  async (req, res) => {


    const user = await User.findById(req.params.id)
      .select("-password");

    return res.status(200).json(user);
  }
);

// Edit Username
router.put("/current", passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    // const user = await User.findById(req.user.id);

    user.username = req.body.username;
    user.save().then(u => res.status(200).send(u)).catch(err => console.log(err));
  })


// Update avatar
router.put("/photo", passport.authenticate("jwt", { session: false }), upload.single('avatar'),
  async (req, res) => {
    console.log("api/user/photo put method ")
    const user = await User.findById(req.user.id);
    console.log("req.file : ", req.file)
    console.log("req.body : ", req.body)
    user.image = req.file.location;
    user.save().then(u => res.status(200).send(u)).catch(err => console.log(err));
  })


// Change password
router.post(
  "/change-pw",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!checkPassword(req.body.password)) {
      return res.status(400).send({ error: "Weak Password" }).end()
    };

    User.findById(req.user.id).then((u) => {
      u.password = req.body.password;

      u.save().then((result) => res.status(200).send({ success: true }));
    });
  }
);

// Verify Email
router.post("/verify/:token", (req, res) => {
  verifyEmail(req.params.token, req, res);
});


// Send Retrieve Password Email
router.post("/forgot-pw", async (req, res) => {
  console.log("body eami : ", req.body.email)
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    res.status(400).json({ error: "This email address does not exist!" });
  if (process.env.NODE_ENV === "production") sendEMail(user, "forgotpw");

  res.status(200).json({ success: true });
});


// Retrieve Password
router.post("/retrieve-pw/:token", (req, res) => {
  retrievePW(req.params.token, req, res);
});


// Find users by username or email
router.post("/search", passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log("comer here/")
  const { username, email } = req.query;
  console.log("username: email :", username, email)

  if (username) {
    await User.find({ username: { "$regex": username, "$options": "i" } }).select('-password').then(users => {
      return res.status(200).json(users)

    }).catch(err => res.status(404).send({ "message": `No users were found with username: ${username}` }));

  }
  else if (email) {

    const users = await User.find({ email: { "$regex": email, "$options": "i" } }).select('-password');
    if (!users) {
      return res.status(404).send({ "message": `No users were found with username: ${email}` })
    }
    return res.status(200).json(users)
  }

});

module.exports = router;
