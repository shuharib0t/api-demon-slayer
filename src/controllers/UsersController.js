const { hash } = require("bcryptjs");

const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const checkEmail = await knex
      .select("*")
      .from("users")
      .whereLike("email", `%${email}%`);

    if (checkEmail.length) {
      throw new AppError("E-mail already exists");
    }

    const hashedPassword = await hash(password, 10);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json();
  }

  async update(req, res) {
    const { name, email } = req.body;
    const { id } = req.params;

    const user = await knex
      .select("*")
      .from("users")
      .where("id", "LIKE", `%${id}%`);

    if (!user.length) {
      throw new AppError("User not found");
    }

    const userWithEmail = await knex
      .select("*")
      .from("users")
      .where("email", "LIKE", `%${email}%`);

    const isEmailFromDiferentUser = userWithEmail.find(
      (userEmail) => userEmail.email !== user[0].email
    );

    if (isEmailFromDiferentUser) {
      throw new AppError("E-mail already exists");
    }

    user.name = name;
    user.email = email;

    await knex("users").where("id", id).update({
      name: user.name,
      email: user.email,
    });

    res.status(201).json();
  }
}

module.exports = UsersController;
