const asyncHandler = require("express-async-handler");
const Author = require("../models/author");

exports.authorList = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  res.render("authorList", { title: "Author List", allAuthors });
});

exports.authorDetail = asyncHandler(async (req, res, next) => {
  res.send(`Author detail: ${req.params.id}`);
});

exports.authorCreateGet = asyncHandler(async (req, res, next) => {
  res.send("Author create get");
});

exports.authorCreatePost = asyncHandler(async (req, res, next) => {
  res.send("Author create post");
});

exports.authorDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("Author delete get");
});

exports.authorDeletePost = asyncHandler(async (req, res, next) => {
  res.send("Author delete post");
});

exports.authorUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("Author update get");
});

exports.authorUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("Author update post");
});
