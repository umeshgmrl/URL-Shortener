const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
	originalUrl: String,
	shortenedUrl: String
});

mongoose.model("urls", urlSchema);
