const knex = require("../database/knex");

class TitlesController {
  async index(req, res) {
    const titles = await knex("titles").groupBy("title");

    return res.status(201).json(titles);
  }
}

module.exports = TitlesController;
