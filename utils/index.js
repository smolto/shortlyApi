const URLSchema = require("./../models/url");
const crypto = require("crypto");

async function findByHash(hash) {
  const response = await URLSchema.findOne({ hash });
  return response;
}

async function findByOriginalUrl(originalUrl) {
  const response = await URLSchema.findOne({ originalUrl });
  return response;
}

async function hashExists(hash) {
  const response = await URLSchema.findOne({ hash });
  if (response) return true;
  return false;
}

async function createHash(originalUrl) {
  var newUrl = new URLSchema({
    originalUrl,
    hash: generateHash(originalUrl, 4),
  });

  const response = await newUrl.save();

  return response;
}

async function deleteHash(hash) {
  const response = await URLSchema.deleteOne({ hash });

  return response;
}

function generateHash(data, len) {
  return crypto
    .createHash("shake256", { outputLength: len })
    .update(data)
    .digest("hex");
}

module.exports = {
  findByOriginalUrl,
  findByHash,
  hashExists,
  createHash,
  deleteHash,
};
