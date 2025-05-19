const express = require("express");
const MailingList = require("../models/mailingList");
const { BadRequestError } = require("../expressError");
const { authenticateToken, authenticateAdmin } = require("../helpers/authMiddleware");

const router = express.Router();

// Subscribe to mailing list (No authentication needed)
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

// Get mailing list subscriptions (Requires JWT authentication)
router.get("/subscriptions", authenticateToken, async (req, res, next) => {
    try {
        const { email, limit, offset } = req.query;

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

// Delete a subscription (Requires admin password)
router.delete("/subscriptions/:email", authenticateAdmin, async (req, res, next) => {
    try {
        const { email } = req.params;
        await MailingList.deleteSubscription(email);
        res.json({ message: "Subscription deleted successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
