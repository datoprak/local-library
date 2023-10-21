const asyncHandler = require("express-async-handler");
const Genre = require("../models/genre");
const Book = require("../models/book");
const mongoose = require("mongoose");

exports.genreList = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genreList", { title: "Genre List", allGenres });
});

exports.genreDetail = asyncHandler(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    const err = new Error("Genre not found.");
    err.status = 404;
    return next(err);
  }
  
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (!genre) {
    const err = new Error("Genre not found.");
    err.status = 404;
    return next(err);
  }

  res.render("genreDetail", { title: "Genre Detail", genre, booksInGenre });
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
