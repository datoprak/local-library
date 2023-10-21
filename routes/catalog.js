const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authorContoller = require("../controllers/authorController");
const genreContoller = require("../controllers/genreController");
const bookInstanceController = require("../controllers/bookInstanceController");

// BOOK ROUTES

router.get("/", bookController.index);

router.get("/book/create", bookController.bookCreateGet);

router.post("/book/create", bookController.bookCreatePost);

router.get("/book/:id/delete", bookController.bookDeleteGet);

router.post("/book/:id/delete", bookController.bookDeletePost);

router.get("/book/:id/update", bookController.bookUpdateGet);

router.post("/book/:id/update", bookController.bookUpdatePost);

router.get("/book/:id", bookController.bookDetail);

router.get("/books", bookController.bookList);

// AUTHOR ROUTES

router.get("/author/create", authorContoller.authorCreateGet);

router.post("/author/create", authorContoller.authorCreatePost);

router.get("/author/:id/delete", authorContoller.authorDeleteGet);

router.post("/author/:id/delete", authorContoller.authorDeletePost);

router.get("/author/:id/update", authorContoller.authorUpdateGet);

router.post("/author/:id/update", authorContoller.authorUpdatePost);

router.get("/author/:id", authorContoller.authorDetail);

router.get("/authors", authorContoller.authorList);

// GENRE ROUTES

router.get("/genre/create", genreContoller.genreCreateGet);

router.post("/genre/create", genreContoller.genreCreatePost);

router.get("/genre/:id/delete", genreContoller.genreDeleteGet);

router.post("/genre/:id/delete", genreContoller.genreDeletePost);

router.get("/genre/:id/update", genreContoller.genreUpdateGet);

router.post("/genre/:id/update", genreContoller.genreUpdatePost);

router.get("/genre/:id", genreContoller.genreDetail);

router.get("/genres", genreContoller.genreList);

// BOOKINSTANCE ROUTES

router.get(
  "/bookinstance/create",
  bookInstanceController.bookInstanceCreateGet
);

router.post(
  "/bookinstance/create",
  bookInstanceController.bookInstanceCreatePost
);

router.get(
  "/bookinstance/:id/delete",
  bookInstanceController.bookInstanceDeleteGet
);

router.post(
  "/bookinstance/:id/delete",
  bookInstanceController.bookInstanceDeletePost
);

router.get(
  "/bookinstance/:id/update",
  bookInstanceController.bookInstanceUpdateGet
);

router.post(
  "/bookinstance/:id/update",
  bookInstanceController.bookInstanceUpdatePost
);

router.get("/bookinstance/:id", bookInstanceController.bookInstanceDetail);

router.get("/bookinstances", bookInstanceController.bookInstanceList);

module.exports = router;
