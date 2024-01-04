const SessionsRepository = require("../repositories/SessionsRepository");
const SessionCreateService = require("../services/SessionCreateService");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    const sessionsRepository = new SessionsRepository();
    const sessionCreateService = new SessionCreateService(sessionsRepository);

    const { user, token } = await sessionCreateService.execute({
      email: email.toLowerCase(),
      password,
    });

    return res.status(201).json({ user, token });
  }
}

module.exports = SessionsController;
