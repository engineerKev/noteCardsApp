
import { gql } from 'apollo-boost';

export const createStack =  gql`
mutation CreateStack($title: String!) {
    createStack(title: $title) {
        title,
        id
    }
}
`;

export const createNoteCard = gql`
mutation CreateNoteCard($question: String!, $answer: String!) {
    createNoteCard(question: $question, answer: $answer) {
        id,
        question, 
        answer,
        parentStack {
            title,
            id
        }
    }
}
`;

export const addNoteCardToStack = gql`
mutation AddNoteCardToStack($noteCardId: String!, $stackId: String!) {
    addNoteCardToStack(noteCardId: $noteCardId, stackId: $stackId) {
        title,
        id,
        notecards {
            question,
            answer
        }
    }
}
`;

export const deleteNoteCard = gql`
mutation DeleteNoteCard($noteCardId: String!) {
    deleteNoteCard(id: $noteCardId) {
        id,
        title,
        question
    }
}
`;