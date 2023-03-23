require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const { findByHash, createHash, findByOriginalUrl } = require("./utils");
const app = express();

app.use(cors());

const port = process.env.PORT;
const uri = process.env.MONGO_DB_URL;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// create application/json parser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.listen(port, function () {
  console.log("Server is running on Port: " + port);
});

app.get("/", async function (req, res) {
  const message = `
		<h1>Welcome to Shortly API</h1>
		<p>Developed by smolto</p>
	`;
  res.send(message);
});

app.get("/hash/:id", urlencodedParser, async function (req, res) {
  const hash = req.params.id;
  const response = await findByHash(hash);

  if (!response) return res.status(400).send({ error: "hash does not exist" });
  res.send({ data: response });
});

app.post("/hash", jsonParser, async function (req, res) {
  const originalUrl = req?.body?.originalUrl;

  if (!originalUrl)
    return res.status(400).send({ error: "originalUrl is required" });

  const response = await findByOriginalUrl(originalUrl);

  if (response) {
    return res.send({ hash: response.hash });
  }

  const hashCreated = await createHash(originalUrl);

  if (!hashCreated)
    res.status(400).send({ error: "There was an error creating hash" });
  res.send({ hash: hashCreated.hash });
});
