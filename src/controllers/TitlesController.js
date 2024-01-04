const TitlesRepository = require("../repositories/TitlesRepository");
const TitleIndexService = require("../services/TitleIndexService");

class TitlesController {
  async index(req, res) {
    const titlesRepository = new TitlesRepository();
    const titleIndexService = new TitleIndexService(titlesRepository);

    const titles = await titleIndexService.execute();

    return res.status(201).json(titles);
  }
}

module.exports = TitlesController;
