const asyncHandler = require("express-async-handler");
const BookInstance = require("../models/bookInstance");
const mongoose = require("mongoose")

exports.bookInstanceList = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate("book").exec();

  res.render("bookInstanceList", {
    title: "Book Instance List",
    allBookInstances,
  });
});

exports.bookInstanceDetail = asyncHandler(async (req, res, next) => {
  const err = new Error("Book copy not found.");
  err.status = 404;

  if (!mongoose.isValidObjectId(req.params.id)) return next(err);

  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (!bookInstance) return next(err);

  res.render("bookInstanceDetail", { title: "Book Instance", bookInstance });
});

exports.bookInstanceCreateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
});

exports.bookInstanceCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
});

exports.bookInstanceDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

exports.bookInstanceDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

exports.bookInstanceUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

exports.bookInstanceUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});
