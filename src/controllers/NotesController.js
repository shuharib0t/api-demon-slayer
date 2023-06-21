const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class NotesController{
  async create(req, res) {
    const { name, age, gender, form, height, weight, description, style, tags, goals } = req.body;
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
      goals,
      user_id
    });

    const tagsInsert = tags.map(title => {
      return {
        note_id,
        title,
        user_id
      }
    });
    
    await knex("tags").insert(tagsInsert);

    return res.status(201).json();
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("title");

    return res.status(201).json({...note, tags});
  }

  async delete(req, res) {
    const { id } = req.params;

    if (id > 7) {
      await knex("notes").where({ id }).delete();
    } else {
      throw new AppError("You can't do this.");
    }

    return res.status(201).json();
  }

  async index(req, res) {
    const { name, tags } = req.query;

    const user_id = req.user.id;

    let notes;

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
        .select([
          "notes.id",
          "notes.name",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id)
        .whereLike("notes.name", `%${name}%`)
        .whereIn("tags.title", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .groupBy("notes.id")
        .orderBy("notes.name");

    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("name", `%${name}%`)
        .orderBy("name");
    }

    const userTags = await knex("tags").where({ user_id });
    const noteWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags,
      }
    })

    return res.status(201).json(noteWithTags);
  }
}

module.exports = NotesController;