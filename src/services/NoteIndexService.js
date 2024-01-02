class NoteIndexService {
  constructor(noteRepository, skillRepository, titleRepository) {
    this.noteRepository = noteRepository;
    this.skillRepository = skillRepository;
    this.titleRepository = titleRepository;
  }

  async execute({ name, titles }) {
    let notes;

    if (titles) {
      const filterTitles = titles.split(",").map((title) => title.trim());
      notes = await this.noteRepository.findNotesByTitlesAndName(
        filterTitles,
        name
      );
    } else {
      notes = await this.noteRepository.findNotesByName(name);
    }

    const notePromises = notes.map(async (note) => {
      const userTitles = await this.titleRepository.findTitlesByNoteId(note.id);
      const noteTitles = userTitles.filter(
        (title) => title.note_id === note.id
      );

      return {
        ...note,
        titles: noteTitles,
      };
    });

    const updatedNotes = await Promise.all(notePromises);
    const sortedNotes = updatedNotes.sort((a, b) => a.id - b.id);

    return sortedNotes;
  }
}

module.exports = NoteIndexService;
