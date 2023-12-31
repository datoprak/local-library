const asyncHandler = require("express-async-handler");
const BookInstance = require("../models/bookInstance");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Book = require("../models/book");

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
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  const bookInstance = {
    imprint: "",
    due_back_yyyy_mm_dd: "",
    status: "",
  };
  res.render("bookInstanceForm", {
    title: "Create Book Instance",
    allBooks,
    bookInstance,
    selectedBook: null,
    errors: null,
  });
});

exports.bookInstanceCreatePost = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { book, imprint, status, due_back } = req.body;
    const bookInstance = new BookInstance({ book, imprint, status, due_back });
    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
      res.render("bookInstanceForm", {
        title: "Create Book Instance",
        bookInstance,
        selectedBook: bookInstance.book._id,
        allBooks,
        errors: errors.array(),
      });
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];

exports.bookInstanceDeleteGet = asyncHandler(async (req, res, next) => {
  const instance = await BookInstance.findById(req.params.id).populate("book");
  if (!instance) res.redirect("/catalog/bookinstances");
  res.render("bookInstanceDelete", { title: "Delete Copy", instance });
});

exports.bookInstanceDeletePost = asyncHandler(async (req, res, next) => {
  await BookInstance.findByIdAndRemove(req.body.id);
  res.redirect("/catalog/bookinstances");
});

exports.bookInstanceUpdateGet = asyncHandler(async (req, res, next) => {
  const [bookInstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).populate("book").exec(),
    Book.find(),
  ]);
  if (!bookInstance) {
    const err = new Error("Copy not found");
    err.status = 404;
    return next(err);
  }
  res.render("bookInstanceForm", {
    title: "Update BookInstance",
    bookInstance,
    allBooks,
    selectedBook: bookInstance.book._id,
    errors: null,
  });
});

exports.bookInstanceUpdatePost = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { book, imprint, status, due_back } = req.body;
    const bookInstance = new BookInstance({
      book,
      imprint,
      status,
      due_back,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const allBooks = Book.find({}, "title").exec();
      res.render("bookInstanceForm", {
        title: "Update BookInstance",
        bookInstance,
        allBooks,
        selectedBook: bookInstance.book._id,
        errors: errors.array(),
      });
    } else {
      await BookInstance.findByIdAndUpdate(req.params.id, bookInstance);
      res.redirect(bookInstance.url);
    }
  }),
];
