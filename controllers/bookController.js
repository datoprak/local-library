const asyncHandler = require("express-async-handler");
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookInstance");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

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
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().exec(),
  ]);

  const book = { title: "", author: "", summary: "", isbn: "", genre: "" };

  res.render("bookForm", {
    title: "Create Book",
    allAuthors,
    allGenres,
    book,
    errors: null,
  });
});

exports.bookCreatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { title, author, summary, isbn, genre } = req.body;
    const book = new Book({ title, author, summary, isbn, genre });

    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().exec(),
      ]);

      allGenres.forEach(genre =>
        book.genre.includes(genre._id)
          ? (genre.checked = "true")
          : (genre.checked = "false")
      );

      res.render("bookForm", {
        title: "Create Book",
        allAuthors,
        allGenres,
        book,
        errors: errors.array(),
      });
    } else {
      await book.save();
      res.redirect(book.url);
    }
  }),
];

exports.bookDeleteGet = asyncHandler(async (req, res, next) => {
  const [book, allInstancesOfBook] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);
  if (!book) res.redirect("/catalog/books");
  res.render("bookDelete", { title: "Delete Book", book, allInstancesOfBook});
});

exports.bookDeletePost = asyncHandler(async (req, res, next) => {
  const [book, allInstancesOfBook] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (allInstancesOfBook.length > 0) {
    res.render("bookDelete", {
      title: "Delete Book",
      book,
      allInstancesOfBook,
    });
  } else {
    await Book.findByIdAndRemove(req.body.id);
    res.redirect("/catalog/books");
  }
});

exports.bookUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update GET");
});

exports.bookUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST");
});
