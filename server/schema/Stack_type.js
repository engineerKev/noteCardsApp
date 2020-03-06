const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const NoteCardType = require('./NoteCard_type');
const Stack = mongoose.model('stack');

const StackType = new GraphQLObjectType({
    name: 'StackType',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        notecards: {
            type: new GraphQLList(NoteCardType),
            resolve(parentValue) {
                return Stack.findNoteCards(parentvalue.id);
            }
        }
    })
});

module.exports = StackType