
const express = require("express");
const router = express.Router();
const passport = require("passport");
const { Message } = require("../models/Message");


// Get Chat Messages
router.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const channelId = req.params.id;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;

    const options = {
        page: page,
        limit: limit,
        sort: { created_at: sort },
        populate: 'user'
    }

    await Message.paginate({ channel: channelId }, options, function (error, pageCount, paginatedResults) {
        res.status(200).json(pageCount);
    });

})


// Get Last Chat Messages
router.get("/last/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const channelId = req.params.id;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;

    const options = {
        page: 1,
        limit: 1,
        sort: { created_at: sort },
        populate: 'user',
        select: '-password -servers'
    }

    const msg = await Message.find({
        channel: channelId
    }).populate({
        path: "user",
        populate: { path: "user" },
        select: '-password -servers'
    }).limit(1).sort({ created_at: -1 })

    console.log("msg: ", msg)
    if (msg.length > 0) {
        res.json(msg[0])
    } else {
        console.log("ehre")
        res.json({})
    }
})

module.exports = router;