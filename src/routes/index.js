const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const notesRouter = require("./notes.routes");
const titlesRouter = require("./titles.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/notes", notesRouter);
routes.use("/titles", titlesRouter);

module.exports = routes;
