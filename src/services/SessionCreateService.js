const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const authConfig = require("../configs/auth");
const AppError = require("../utils/AppError");

class SessionCreateService {
  constructor(sessionsRepository) {
    this.sessionsRepository = sessionsRepository;
  }

  async execute({ email, password }) {
    const user = await this.sessionsRepository.getUserByEmail(email);

    if (!user) {
      throw new AppError("E-mail/password is wrong", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail/password is wrong", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return { user, token };
  }
}

module.exports = SessionCreateService;
