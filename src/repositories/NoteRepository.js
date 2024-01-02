const knex = require("../database/knex");

class NoteRepository {
  async createNote({
    name,
    age,
    gender,
    form,
    height,
    weight,
    description,
    style,
    user_id,
  }) {
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

    return note_id;
  }

  async findNoteById(id) {
    return await knex("notes").where({ id }).first();
  }

  async findNotesByName(name) {
    return await knex("notes")
      .where("name", "like", `%${name}%`)
      .orderBy("name");
  }

  async findNotesByTitlesAndName(filterTitles, name) {
    return await knex("titles")
      .whereLike("notes.name", `%${name}%`)
      .whereIn("titles.title", filterTitles)
      .innerJoin("notes", "notes.id", "titles.note_id")
      .groupBy("notes.id")
      .orderBy("notes.name");
  }
}

module.exports = NoteRepository;
