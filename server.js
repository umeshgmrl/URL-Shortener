"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const { Schema } = mongoose;
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const urlSchema = new Schema({
	originalUrl: String,
	index: Number
});

const URL = mongoose.model("URL", urlSchema);

mongoose.connect(
	process.env.MONGO_URI,
	() => console.log("connected")
);

var port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.post("/api/shorturl/new", async function(req, res) {
	const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
	if (!urlRegex.test(req.body.url)) return res.json({ error: "invalid URL" });
	const url = await URL.findOne({ originalUrl: req.body.url });
	if (url) {
		return res.json({ original_url: url.originalUrl, short_url: url.index });
	} else {
		const index = (await URL.count()) + 1;
		const url = new URL({
			originalUrl: req.body.url,
			index
		});
		url
			.save()
			.then(doc =>
				res.json({ original_url: doc.originalUrl, short_url: doc.index })
			);
	}
});

app.get("/api/shorturl/:index", async function(req, res) {
	const index = parseInt(req.params.index);
	const url = await URL.findOne({ index });
	res.redirect(url.originalUrl);
});

app.listen(port, function() {
	console.log("Node.js listening ...");
});
