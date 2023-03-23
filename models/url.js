const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let urlSchema = new Schema(
  {
    originalUrl: {
      type: String,
    },
    hash: {
      type: String,
    },
  },
  { collection: "url" }
);

module.exports = mongoose.model("url", urlSchema);
