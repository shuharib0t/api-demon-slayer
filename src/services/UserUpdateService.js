const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UserUpdateService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ id, name, email, password, old_password }) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found.");
    }

    const userWithEmail = await this.userRepository.findByEmail(email);

    const isEmailFromDifferentUser = userWithEmail.some(
      (userEmail) => userEmail.id !== user.id
    );

    if (isEmailFromDifferentUser) {
      throw new AppError("E-mail já está em uso por outro usuário.");
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        "É necessário informar a senha antiga para definir uma nova senha."
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga incorreta.");
      }

      user.password = await hash(password, 10);
    }

    await this.userRepository.update({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });

    return user;
  }
}

module.exports = UserUpdateService;
