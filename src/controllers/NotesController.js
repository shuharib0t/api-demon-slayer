const knex = require("../database/knex");

class NotesController{
  async create(req, res) {
    const { title, description, tags } = req.body;
    const { user_id } = req.params;

    const [note_id] = await knex("notes").insert({
      title,
      description,
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

    res.status(201).json();
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("title");

    return res.status(201).json({...note, tags});
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("notes").where({ id }).delete();

    return res.status(201).json();
  }

  async index(req, res) {
    const { title, user_id, tags } = req.query;

    let notes;

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
        .whereIn("title", filterTags)

    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    return res.status(201).json(notes);
  }
}

module.exports = NotesController;