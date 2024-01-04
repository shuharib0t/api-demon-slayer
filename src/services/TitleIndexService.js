const knex = require("../database/knex");

class TitleIndexService {
  constructor(titlesRepository) {
    this.titlesRepository = titlesRepository;
  }

  async execute() {
    const titles = await this.titlesRepository.getAllTitles();
    return titles;
  }
}

module.exports = TitleIndexService;
