class NoteShowService {
  constructor(noteRepository, skillRepository, titleRepository) {
    this.noteRepository = noteRepository;
    this.skillRepository = skillRepository;
    this.titleRepository = titleRepository;
  }

  async execute(id) {
    const note = await this.noteRepository.findNoteById(id);

    if (!note) {
      throw new AppError("Nota não encontrada.", 404);
    }

    const skills = await this.skillRepository.findSkillsByNoteId(id);
    const titles = await this.titleRepository.findTitlesByNoteId(id);

    return { ...note, skills, titles };
  }
}

module.exports = NoteShowService;
