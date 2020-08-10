const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models/User");
const { sendEMail } = require("../utils/email");
const { getKeyValue, deleteKeyValue } = require("../utils/redis");
const { assignWith } = require("lodash");

// Get Current User
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.id)
      .populate("teams")
      .select("-password");

    return res.status(200).json(user);
  }
);

// Change password
router.post(
  "/change-pw",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    User.findById(req.user.id).then((u) => {
      u.password = req.body.password;

      u.save().then((result) => res.status(200).send({ success: true }));
    });
  }
);

// Send Retrieve Password Email
router.post("/forgot-pw", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    res.status(400).json({ error: "This email address does not exist!" });
  if (process.env.NODE_ENV === "production") sendEMail(user, "forgotpw");

  res.status(200).json({ success: true });
});

// Retrieve Password
router.post("/retrieve-pw/:token", (req, res) => {
  getKeyValue(req.params.token, req, res);
});

module.exports = router;
