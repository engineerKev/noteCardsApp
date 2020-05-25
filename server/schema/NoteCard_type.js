const mongoose = require('mongoose');
const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLString
} = graphql;

const Stack = mongoose.model('stack');

const NoteCardType = new GraphQLObjectType({
    name: 'NoteCardType',
    fields: () => ({
        id: { type: GraphQLID },
        question: { type: GraphQLString },
        answer: { type: GraphQLString },
        parentStack: {
            type: require('./Stack_type'),
            resolve(parentValue) {
                return Stack.find({})
                    .then(stacks => {
                        let ownerStack = null;
                        stacks.forEach(stack => {
                            if (stack.noteCards.indexOf(parentValue.id) !== -1) {
                                ownerStack = stack;
                            }
                        });
                        return ownerStack
                    })
            }
        }

    })
});

module.exports = NoteCardType; 