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
    const { name, email, password, old_password } = req.body;
    const { id } = req.params;

    const user = await knex("users").where("id", id);

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

    user[0].name = name;
    user[0].email = email;

    if (password && !old_password) {
      throw new AppError("You need to put old password before new password");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user[0].password);

      if (!checkOldPassword) {
        throw new AppError("Old password is wrong");
      }

      user[0].password = await hash(password, 10);
    }

    await knex("users").where("id", id).update({
      name: user[0].name,
      email: user[0].email,
      password: user[0].password,
    });

    res.status(201).json();
  }
}

module.exports = UsersController;
