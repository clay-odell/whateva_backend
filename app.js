const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const songRequestRoutes = require("./routes/songRequests");
const { NotFoundError, ExpressError } = require("./expressError");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", songRequestRoutes);

app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ error: message });
});

module.exports = app;
