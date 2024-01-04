const knex = require("../database/knex");

class SkillRepository {
  async createSkills(note_id, skills, user_id) {
    const skillsInsert = skills.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });

    await knex("skills").insert(skillsInsert);
  }

  async findSkillsByNoteId(note_id) {
    return await knex("skills").where({ note_id }).orderBy("id");
  }
}

module.exports = SkillRepository;
