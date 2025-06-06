const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const songRequestRoutes = require("./routes/songRequestRoute");
const mailingListRoutes = require("./routes/mailingListRoutes");
const loginRoute = require("./routes/loginRoute"); // Import login route
const { NotFoundError } = require("./expressError");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://drwhateva.com",
  methods: "GET, POST, OPTIONS, DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(morgan("dev"));

app.use("/api", songRequestRoutes);
app.use("/api/mailing-list", mailingListRoutes);
app.use("/api/auth", loginRoute);

app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
});

module.exports = app;
