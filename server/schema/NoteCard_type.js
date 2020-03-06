const mongoose = require('mongoose');
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString
} = graphql;

const NoteCard = mongoose.model('notecard');

const NoteCardType = new GraphQLObjectType({
    name: 'NoteCardType',
    fields: () => ({
        id: { type: GraphQLID },
        question: { type: GraphQLString },
        answer: { type: GraphQLString },
        stack: {
            type: require('./Stack_type'),
            resolve(parentValue) {
                return NoteCard.findById(parentValue).populate('stack')
                    .then(notecard => {
                        console.log(notecard);
                        return notecard.stack;
                    });
            }
        }

    })
});

module.exports = NoteCardType; 