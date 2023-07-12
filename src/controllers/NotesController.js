const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController {
  async create(req, res) {
    const {
      name,
      age,
      gender,
      form,
      height,
      weight,
      description,
      style,
      skills,
      titles,
    } = req.body;

    const user_id = req.user.id;

    const [note_id] = await knex("notes").insert({
      name,
      age,
      gender,
      form,
      height,
      weight,
      description,
      style,
      user_id,
    });

    const skillsInsert = skills.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    await knex("skills").insert(skillsInsert);

    const titlesInsert = titles.map((title) => {
      return {
        note_id,
        title,
        user_id,
      };
    });

    await knex("titles").insert(titlesInsert);

    return res.status(201).json({ id: note_id });
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex("notes").where({ id }).first();
    const skills = await knex("skills").where({ note_id: id }).orderBy("id");
    const titles = await knex("titles").where({ note_id: id });

    return res.status(201).json({ ...note, skills, titles });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (id > 39) {
      await knex("notes").where({ id }).delete();
    } else {
      throw new AppError("You can't do this.");
    }

    return res.status(201).json();
  }

  async index(req, res) {
    const { name, titles } = req.query;

    let notes;

    if (titles) {
      const filterTitles = titles.split(",").map((title) => title.trim());

      notes = await knex("titles")
        .whereLike("notes.name", `%${name}%`)
        .whereIn("titles.title", filterTitles)
        .innerJoin("notes", "notes.id", "titles.note_id")
        .groupBy("notes.id")
        .orderBy("notes.name");
    } else {
      notes = await knex("notes")
        .whereLike("name", `%${name}%`)
        .orderBy("name");
    }

    const userTitles = await knex("titles");
    const noteWithTitles = notes.map((note) => {
      const noteTitles = userTitles.filter(
        (title) => title.note_id === note.id
      );

      return {
        ...note,
        titles: noteTitles,
      };
    });

    const updatedNotes = noteWithTitles.sort((a, b) => a.id - b.id);

    return res.status(201).json(updatedNotes);
  }
}

module.exports = NotesController;
