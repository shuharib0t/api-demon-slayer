const { Router } = require("express");
const multer = require("multer");

const uploadConfig = require("../configs/upload");
const NotesController = require("../controllers/NotesController");
const NoteAvatarController = require("../controllers/NoteAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesController = new NotesController();
const noteAvatarController = new NoteAvatarController();

const notesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

notesRoutes.use(ensureAuthenticated);

notesRoutes.post("/", notesController.create);
notesRoutes.put("/:id", notesController.update);
notesRoutes.get("/", notesController.index);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);
notesRoutes.patch(
  "/avatar/:id",
  upload.single("avatar"),
  noteAvatarController.create
);

module.exports = notesRoutes;
