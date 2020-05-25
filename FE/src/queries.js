import { gql } from 'apollo-boost';

export const getStacks =  gql`
query {
    stacks{
        title,
        notecards {
            question,
            answer
        },
        id
    }
}
`;

export const getStack = gql`
query Stack($stackId: String!) {
    stack(id: $id) {
        title,
        noteCards
    }
}`;

export const noteCard = gql`
query NoteCard($notecardId: String!) {
    noteCard(id: $notecardId) {
        question,
        answer,
        parentStack {
            title
        }
    }
}`;

export const stacksNoteCards = gql`
query StacksNoteCards($stackId: String!) {
    stacksNoteCards(id: $stackId) {
        question,
        answer
    }
}
`;
