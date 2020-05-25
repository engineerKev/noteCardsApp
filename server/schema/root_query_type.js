const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString } = graphql;
const NoteCardType = require('./NoteCard_type');
const StackType = require('./Stack_type.js');
const mongoose= require('mongoose');
const NoteCard = mongoose.model('notecard');
const Stack = mongoose.model('stack');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        stacks: {
            type: new GraphQLList(StackType),
            resolve() {
                return Stack.find({});
            }
        },
        stack: {
            type: StackType,
            args: {id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parentValue, { id }) {
                return Stack.findById(id)
            }
        },
        noteCard: {
            type: NoteCardType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parnetValue, { id }) {
                return NoteCard.findById(id);
            }
        },
        stacksNoteCards: {
            type: new GraphQLList(NoteCardType),
            args: {id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parentValue, { id }) {
                return Stack.findNoteCards(id);
            }
        }
    })
});

module.exports = RootQuery;