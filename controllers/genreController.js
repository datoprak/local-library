const asyncHandler = require("express-async-handler");

exports.genreList = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre list");
});

exports.genreDetail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
});

exports.genreCreateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

exports.genreCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

exports.genreDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

exports.genreUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
