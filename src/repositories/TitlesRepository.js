const knex = require("../database/knex");

class TitlesRepository {
  async createTitles(note_id, titles, user_id) {
    const titlesInsert = titles.map((title) => {
      return {
        note_id,
        title,
        user_id,
      };
    });

    await knex("titles").insert(titlesInsert);
  }

  async getAllTitles() {
    const titles = await knex("titles").groupBy("title");
    return titles;
  }

  async findTitlesByNoteId(note_id) {
    return await knex("titles").where({ note_id });
  }
}

module.exports = TitlesRepository;
