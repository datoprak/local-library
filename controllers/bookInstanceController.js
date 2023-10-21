const asyncHandler = require("express-async-handler");
const BookInstance = require("../models/bookInstance");

exports.bookInstanceList = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate("book").exec();

  res.render("bookInstanceList", {
    title: "Book Instance List",
    allBookInstances,
  });
});

exports.bookInstanceDetail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
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
