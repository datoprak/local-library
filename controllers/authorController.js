const asyncHandler = require("express-async-handler");
const Author = require("../models/author");
const Book = require("../models/book");
const mongoose = require("mongoose")

exports.authorList = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  res.render("authorList", { title: "Author List", allAuthors });
});

exports.authorDetail = asyncHandler(async (req, res, next) => {
  const err = new Error("Author not found.");
  err.status = 404;

  if (!mongoose.isValidObjectId(req.params.id)) return next(err);

  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (!author) return next(err);

  res.render("authorDetail", {
    title: author.name,
    author,
    allBooksByAuthor,
  });
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
