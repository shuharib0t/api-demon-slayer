const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const check = await knex
      .select("*")
      .from("users")
      .where("email", "LIKE", `%${email}%`);

    console.log(check);

    if (check.length) {
      throw new AppError("E-mail already exists");
    }

    await knex("users").insert({
      name,
      email,
      password,
    });

    res.status(201).json({ name, email, password });
  }
}

module.exports = UsersController;
