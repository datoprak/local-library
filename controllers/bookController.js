const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookInstance");
const mongoose = require("mongoose")

exports.index = asyncHandler(async (req, res, next) => {
  const [
    bookCount,
    bookInstanceCount,
    availableBookInstanceCount,
    authorCount,
    genreCount,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Library Home",
    bookCount,
    bookInstanceCount,
    availableBookInstanceCount,
    authorCount,
    genreCount,
  });
});

exports.bookList = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();

  res.render("bookList", { title: "Book List", allBooks });
});

exports.bookDetail = asyncHandler(async (req, res, next) => {
  const err = new Error("Book not found.");
  err.status = 404;

  if (!mongoose.isValidObjectId(req.params.id)) return next(err);

  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (!book) return next(err);

  res.render("bookDetail", { title: book.title, book, bookInstances });
});

exports.bookCreateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create GET");
});

exports.bookCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book create POST");
});

exports.bookDeleteGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

exports.bookDeletePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

exports.bookUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

exports.bookUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
