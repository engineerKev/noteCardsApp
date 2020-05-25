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
        createStack: {
            type: StackType,
            args: {
                title: { type: GraphQLString }
            },
            resolve(parentValue, { title }) {
                return (new Stack({ title })).save()
            }
        },
        createNoteCard: {
            type: NoteCardType,
            args: {
                question: { type: GraphQLString },
                answer: { type: GraphQLString }
            },
            resolve(parentValue, { question, answer }) {
                return (new NoteCard({ question, answer })).save()
            }
        },
        addNoteCardToStack: {
            type: StackType,
            args: {
                noteCardId: { type: GraphQLString },
                stackId: { type: GraphQLString }
            },
            resolve(parentValue, { stackId, noteCardId }) {
                return Stack.addNoteCard(stackId, noteCardId)
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