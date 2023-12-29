const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");
const UserUpdateService = require("../services/UserUpdateService");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);

    await userCreateService.execute({ name, email, password });

    return res.status(201).json();
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    const userRepository = new UserRepository();
    const userUpdateService = new UserUpdateService(userRepository);

    const updatedUser = await userUpdateService.execute({
      id: user_id,
      name,
      email,
      password,
      old_password,
    });

    return res.json(updatedUser);
  }
}

module.exports = UsersController;
