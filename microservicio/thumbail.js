"use strict";
const cote = require("cote");
var jimp = require("jimp");

const responder = new cote.Responder(
  { name: "thumbnail maker" },
  { log: false, statusLogsEnabled: false }
);

const appendSuffix = (fileName, suffix) => {
  const dotPos = fileName.lastIndexOf(".");
  return fileName.substr(0, dotPos) + suffix + fileName.substr(dotPos);
};

// image: string with image path
responder.on("createThumbnail", async (req) => {
  const src = req.image;
  const dst = appendSuffix(src, "_thumbnail");

  const image = await jimp.read(req.image);
  return image.scaleToFit(100, 100).write(dst);
});
