const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnauthorizedError } = require("../expressError");

const router = express.Router();

router.post("/login", (req, res) => {
    const { password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});

module.exports = router;
