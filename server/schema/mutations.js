const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const mongoose = require('mongoose');
const NoteCard = mongoose.model('notecard');
const Stack = mongoose.model('stack');
const NoteCardType = require('./NoteCard_type');
const StackType = require('./Stack_type');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addNoteCard: {
            type: NoteCardType,
            args: {
                question: { type: GraphQLString },
                answer: { type: GraphQLString }
                // noteCardId: { type: { GraphQLID } }
            },
            resolve(parentValue, { question, answer }) {
                return (new NoteCard({ question, answer })).save()
            }
        },
        addNoteCardToStack: {
            type: StackType,
            args: {
                question: { type: GraphQLString },
                answer: { type: GraphQLString },
                stackId: { type: GraphQLID }
            },
            resolve(parentValue, { answer, question, stackId }) {
                return Stack.addNoteCard(stackId, question, answer)
            }
        },
        deleteNoteCard: {
            type: NoteCardType,
            args: { id: { type: GraphQLID } },
            resolve( parentValue, { id } ) {
                return NoteCard.remove({ _id: id });
            }
        }
    }
});

module.exports = mutation;