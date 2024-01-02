class NoteCreateService {
  constructor(noteRepository, skillRepository, titleRepository) {
    this.noteRepository = noteRepository;
    this.skillRepository = skillRepository;
    this.titleRepository = titleRepository;
  }

  async execute({
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
  }) {
    const note_id = await this.noteRepository.createNote({
      name,
      age,
      gender,
      form,
      height,
      weight,
      description,
      style,
      user_id,
    });

    await this.skillRepository.createSkills(note_id, skills, user_id);
    await this.titleRepository.createTitles(note_id, titles, user_id);

    return { id: note_id };
  }
}

module.exports = NoteCreateService;
