const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const songRequestRoutes = require("./routes/songRequestRoute");
const mailingListRoutes = require("./routes/mailingListRoutes");
const { NotFoundError } = require("./expressError");

const app = express();

app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: "https://drwhateva.com",
  methods: "GET, POST, OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(morgan("dev"));

app.use("/api", songRequestRoutes);
app.use("/api/mailing-list", mailingListRoutes);

app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

module.exports = app;
