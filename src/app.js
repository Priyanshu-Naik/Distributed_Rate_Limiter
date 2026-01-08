const express = require("express");
const app = express();

app.use(express.json());

const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

module.exports = app;