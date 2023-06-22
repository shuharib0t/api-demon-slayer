const knex = require("../database/knex");

class TitlesController {
  async index(req, res) {
    const user_id  = req.user.id;

    const titles = await knex("titles")
      .where({ user_id })
      .groupBy("title");

    return res.status(201).json(titles);
  }
}

module.exports = TitlesController;