const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StackSchema = new Schema({
      noteCards: [{
          type: Schema.Types.ObjectId,
          ref: 'notecard'
      }]
});

StackSchema.statics.addNoteCard = function(id, question, answer) {
    const NoteCard = mongoose.model('notecard');

    return this.findById(id)
        .then(stack => {
            const notecard = new NoteCard({question, answer});
            stack.noteCards.push(notecard);
            return Promise.all([notecard.save(), stack.save()])
                .then(([notecard, stack]) => stack);
        });
}

StackSchema.statics.findNoteCards = function(id) {
    return this.findById(id)
        .populate('noteCards')
        .then( stack => stack.noteCards);
}

mongoose.model('stack', StackSchema);