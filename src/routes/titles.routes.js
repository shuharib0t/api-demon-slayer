const { Router } = require("express");

const TitlesController = require("../controllers/TitlesController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const titlesController = new TitlesController();

const titlesRoutes = Router();

titlesRoutes.get("/", ensureAuthenticated, titlesController.index);

module.exports = titlesRoutes;
