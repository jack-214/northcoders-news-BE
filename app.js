const express = require("express");
const apiRouter = require("./routes/api.router");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.static("public"));

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
