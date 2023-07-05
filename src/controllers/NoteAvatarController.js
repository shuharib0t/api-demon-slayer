const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class NoteAvatarController {
  async create(req, res) {
    const note_id = req.params.id;

    const avatarFileName = req.file.filename;

    const diskStorage = new DiskStorage();

    const note = await knex("notes").where({ id: note_id }).first();

    if (note.avatar) {
      await diskStorage.deleteFile(note.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFileName);

    note.avatar = filename;

    await knex("notes").update(note).where({ id: note_id });

    return res.status(201).json(note);
  }
}

module.exports = NoteAvatarController;
