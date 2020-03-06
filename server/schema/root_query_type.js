const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
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
            args: {id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, { id }) {
                return Stack.findById(id)
            }
        },
        noteCard: {
            type: NoteCardType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parnetValue, { id }) {
                return NoteCard.findById(id);
            }
        },
    })
});

module.exports = RootQuery;