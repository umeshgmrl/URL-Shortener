"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var cors = require("cors");
var app = express();
require("./UrlModel");
const URL = mongoose.model("urls");

mongoose.connect("");

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/shorturl/:url", function(req, res) {
	res.json({ url: req.params.url });
});

app.listen(port, function() {
	console.log("Node.js listening ...");
});
