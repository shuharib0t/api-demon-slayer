const NoteRepository = require("../repositories/NoteRepository");
const SkillRepository = require("../repositories/SkillRepository");
const TitleRepository = require("../repositories/TitleRepository");

const NoteCreateService = require("../services/NoteCreateService");
const NoteShowService = require("../services/NoteShowService");
const NoteIndexService = require("../services/NoteIndexService");

const noteRepository = new NoteRepository();
const skillRepository = new SkillRepository();
const titleRepository = new TitleRepository();

class NotesController {
  async create(req, res) {
    const {
      name,
      age,
      gender,
      form,
      height,
      weight,
      description,
      style,
      skills,
      titles,
    } = req.body;

    const user_id = req.user.id;

    const noteCreateService = new NoteCreateService(
      noteRepository,
      skillRepository,
      titleRepository
    );

    const result = await noteCreateService.execute({
      name,
      age,
      gender,
      form,
      height,
      weight,
      description,
      style,
      user_id,
      skills,
      titles,
    });

    return res.status(201).json(result);
  }

  async show(req, res) {
    const { id } = req.params;

    const noteShowService = new NoteShowService(
      noteRepository,
      skillRepository,
      titleRepository
    );

    const result = await noteShowService.execute(id);
    return res.status(200).json(result);
  }

  async index(req, res) {
    const { name, titles } = req.query;

    const noteIndexService = new NoteIndexService(
      noteRepository,
      skillRepository,
      titleRepository
    );

    const result = await noteIndexService.execute({ name, titles });
    return res.status(200).json(result);
  }
}

module.exports = NotesController;
