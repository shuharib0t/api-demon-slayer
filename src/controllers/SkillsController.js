const knex = require("../database/knex");

class SkillsController {
  async index(req, res) {
    const user_id  = req.user.id;

    const skills = await knex("skills")
      .where({ user_id })
      .groupBy("name");

    return res.status(201).json(skills);
  }
}

module.exports = SkillsController;