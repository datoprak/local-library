const asyncHandler = require("express-async-handler");
const Author = require("../models/author");
const Book = require("../models/book");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.authorList = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ first_name: 1 }).exec();
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

exports.authorCreateGet = (req, res, next) => {
  const author = {
    first_name: "",
    family_name: "",
    date_of_birth: "",
    date_of_death: "",
  };
  res.render("authorForm", { title: "Create Author", author, errors: null });
};

exports.authorCreatePost = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { first_name, last_name, date_of_birth, date_of_death } = req.body;
    const author = new Author({
      first_name,
      last_name,
      date_of_birth,
      date_of_death,
    });
    if (!errors.isEmpty()) {
      res.render("authorCreate", {
        title: "Create Author",
        author,
        errors: errors.array(),
      });
      return;
    } else {
      await author.save();
      res.redirect(author.url);
    }
  }),
];

exports.authorDeleteGet = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (!author) res.redirect("/catalog/authors");

  res.render("authorDelete", {
    title: "Delete Author",
    author,
    allBooksByAuthor,
  });
});

exports.authorDeletePost = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor.length > 0) {
    res.render("authorDelete", {
      title: "Delete Author",
      author,
      allBooksByAuthor,
    });
  } else {
    await Author.findByIdAndRemove(req.body.authorid);
    res.redirect("/catalog/authors");
  }
});

exports.authorUpdateGet = asyncHandler(async (req, res, next) => {
  res.send("Author update get");
});

exports.authorUpdatePost = asyncHandler(async (req, res, next) => {
  res.send("Author update post");
});
