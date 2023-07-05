const { hash, compare } = require("bcryptjs");

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
      throw new AppError("E-mail already exists.");
    }

    const hashedPassword = await hash(password, 10);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("User not found.");
    }

    const userWithEmail = await knex
      .select("*")
      .from("users")
      .whereLike("email", `%${email}%`);

    const isEmailFromDiferentUser = userWithEmail.find(
      (userEmail) => userEmail.email !== user.email
    );

    if (isEmailFromDiferentUser) {
      throw new AppError("E-mail already exists.");
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError("You need to put old password before new password.");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password is wrong.");
      }

      user.password = await hash(password, 10);
    }

    await knex("users").where({ id: user_id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    return res.status(201).json();
  }
}

module.exports = UsersController;
