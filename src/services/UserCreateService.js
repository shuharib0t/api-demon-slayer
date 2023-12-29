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

    const regexEmail = new RegExp("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");

    if (!regexEmail.test(email)) {
      throw new AppError("Please enter a valid e-mail.", 401);
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
