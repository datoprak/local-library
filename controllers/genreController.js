const asyncHandler = require("express-async-handler");
const Genre = require("../models/genre");
const Book = require("../models/book");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.genreList = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genreList", { title: "Genre List", allGenres });
});

exports.genreDetail = asyncHandler(async (req, res, next) => {
  const err = new Error("Genre not found.");
  err.status = 404;

  if (!mongoose.isValidObjectId(req.params.id)) return next(err);

  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (!genre) return next(err);

  res.render("genreDetail", { title: "Genre Detail", genre, booksInGenre });
});

exports.genreCreateGet = (req, res, next) => {
  const genre = { name: "" };
  res.render("genreForm", { title: "Create Genre", errors: null, genre });
};

exports.genreCreatePost = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      const genreExist = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExist) res.redirect(genreExist.url);
      else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

exports.genreDeleteGet = asyncHandler(async (req, res, next) => {
  const [genre, allBooksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (!genre) res.redirect("/catalog/genres");
  res.render("genreDelete", { title: "Delete Genre", genre, allBooksInGenre });
});

exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  const [genre, allBooksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);
  if (allBooksInGenre.length > 0) {
    res.render("genreDelete", {
      title: "Delete Genre",
      genre,
      allBooksInGenre,
    });
  } else {
    await Genre.findByIdAndRemove(req.body.id);
    res.redirect("/catalog/genres");
  }
});

exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  res.render("genreForm", { title: "Update Genre", genre, errors: null });
});

exports.genreUpdatePost = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name, _id: req.params.id });
    if (!errors.isEmpty()) {
      res.render("genreForm", {
        title: "Update Genre",
        genre,
        errors: errors.array(),
      });
    } else {
      await Genre.findByIdAndUpdate(req.params.id, genre);
      res.redirect(genre.url);
    }
  }),
];
