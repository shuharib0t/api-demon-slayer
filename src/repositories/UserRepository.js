const knex = require("../database/knex");

class UserRepository {
  async findById(id) {
    return await knex("users").where({ id }).first();
  }

  async findByEmail(email) {
    return await knex("users").where("email", "like", `%${email}%`);
  }

  async create({ name, email, password }) {
    const userId = await knex("users").insert({
      name,
      email,
      password,
    });

    return { id: userId };
  }

  async update({ id, name, email, password }) {
    await knex("users").where({ id }).update({
      name,
      email,
      password,
    });
  }
}

module.exports = UserRepository;
