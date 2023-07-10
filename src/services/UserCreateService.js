const { hash } = require("bcryptjs");

const AppError = require("../utils/AppError");

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password }) {
    const checkEmail = await this.userRepository.findByEmail(email);

    if (checkEmail.length) {
      throw new AppError("E-mail already exists.");
    }

    if (!Array.isArray(checkEmail)) {
      throw new AppError("test");
    }

    const hashedPassword = await hash(password, 10);

    const userCreated = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return userCreated;
  }
}

module.exports = UserCreateService;
