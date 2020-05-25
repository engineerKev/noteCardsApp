const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StackSchema = new Schema({
    title: { type: String },
    noteCards: [{
        type: Schema.Types.ObjectId,
        ref: 'notecard'
    }]
});

StackSchema.statics.addNoteCard = function(stackId, noteCardId) {
    const NoteCard = mongoose.model('notecard');

    return this.findById(stackId)
        .then(stack => {
            return NoteCard.findById(noteCardId)
                .then(noteCard => {
                    stack.noteCards.push(noteCard);
                    return Promise.all([stack.save()])
                        .then(([stack]) => stack);
                })
        });
}

StackSchema.statics.findNoteCards = function(id) {
    return this.findById(id)
        .populate('noteCards')
        .then( stack => {
            return stack.noteCards
        });
}

mongoose.model('stack', StackSchema);