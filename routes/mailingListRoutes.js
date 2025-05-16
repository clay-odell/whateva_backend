const express = require("express");
const MailingList = require("../models/MailingList");
const { BadRequestError } = require("../expressError");

const router = express.Router();

// Subscribe to mailing list
router.post("/subscribe", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new BadRequestError("Email is required");

    const newSubscription = await MailingList.subscribe(email);
    res.status(201).json({ subscription: newSubscription });
  } catch (err) {
    next(err);
  }
});

// Get mailing list subscriptions with optional filters
router.get("/subscriptions", async (req, res, next) => {
  try {
    const { email, limit, offset } = req.query;

    // Convert limit and offset to numbers if provided
    const options = {
      email: email || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };

    const subscriptions = await MailingList.getSubscriptions(options);
    res.json({ emails: subscriptions });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
