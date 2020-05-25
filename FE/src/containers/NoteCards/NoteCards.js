import React, { useState, useEffect } from 'react';
import { onErrorFunc } from '../../hooks/useGraphQLErrors';
import { useQuery } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';

import Modal from '../../components/Modal/Modal';
import Button from '../../components/UI/Button/Button';

import { stacksNoteCards } from '../../queries';

const NoteCards = (props) => {
    //state(s)
    const [hasServerError, setServerError] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [noteCardControls, setNoteCardControls] = useState({
        "noteCardIndex": -1,
        "sideOfCard": "Question"

    });
    const [modalContent, setModalContent] = useState(null);

    //pass stackId in route
    const location = useLocation();
    const stackId = new URLSearchParams(location.search).get('stackId');
    
    //queries and mutations
    const { loading: isNoteCardsInStackLoading, error: noteCardsInStackError, data: noteCardsInStacks } = useQuery(stacksNoteCards,{
        variables: {
            stackId 
        },
        onError: (error) => onErrorFunc(error, props.history.location.pathname, {
            type: "query",
            name: "stacksNoteCards"
        })
    });
    
    //helper functions    
    const closeModal = () => {
        setModalOpen(false);
    }

    const showAnswer = () => {
        const updatedNoteCardControls = {
            ...noteCardControls,
            "sideOfCard": "Answer"
        };
        setNoteCardControls(updatedNoteCardControls);
    }

    const shuffleNoteCards = (notecardsArr) => {
        const min = 0;
        let max = notecardsArr.length;
        while(max > 1) {
            const k = Math.floor(Math.random() * (max - min)) + min;
            max -= 1;
            const temp = notecardsArr[max];
            notecardsArr[max] = notecardsArr[k];
            notecardsArr[k] = temp;
        }
        return notecardsArr;
    }

    //add function that updates next index below
    const nextCard = () => {
        const { noteCardIndex } = noteCardControls;
        let currentIndex = noteCardIndex + 1;
        if(currentIndex === noteCardsInStacks.stacksNoteCards.length) {
            currentIndex = 0;
        }
        setNoteCardControls({
            "noteCardIndex": currentIndex,
            "sideOfCard": "Question"
        })
    }

    const setFirstCard = () => {
        const updatedNoteCardControls = {
            ...noteCardControls,
            "noteCardIndex": 0
        };
        setNoteCardControls(updatedNoteCardControls);
    }

    //useEffect(s)
    useEffect(() => {
        if(noteCardsInStackError) {
            setServerError(true);
        }
    }, [noteCardsInStackError]);

    useEffect(() => {
        let content = null;
        const { noteCardIndex, sideOfCard } = noteCardControls;
        switch (sideOfCard){
            case "Question":
                content = noteCardIndex >= 0 && noteCardsInStacks.stacksNoteCards.length ?
                    (
                        <React.Fragment>
                            <h4>{noteCardsInStacks && noteCardsInStacks.stacksNoteCards[noteCardIndex].question}</h4>
                            <Button btnType={"Success"} clicked={() => showAnswer()} >SHOW ANSWER</Button>
                        </React.Fragment>
                    )
                : 
                    null;
                setModalContent(content);
                break;
            case "Answer":
                content = noteCardIndex >= 0 ?
                    (
                        <React.Fragment>
                            <h4>{noteCardsInStacks && noteCardsInStacks.stacksNoteCards[noteCardIndex].answer}</h4>
                            <Button btnType={"Success"} clicked={() => nextCard()} >NEXT NOTECARD</Button>
                        </React.Fragment>
                    )
                :
                    null;
                setModalContent(content);
                break;
            default:
                setModalContent(null);
                break;
        }
    }, [noteCardsInStacks, noteCardControls]);

    useEffect(() => {
        if(noteCardsInStacks && !isNoteCardsInStackLoading) {
            console.log("preSort: ", noteCardsInStacks.stacksNoteCards);
            let noteCards = [...noteCardsInStacks.stacksNoteCards];
            noteCardsInStacks.stacksNoteCards = shuffleNoteCards(noteCards);
            console.log("postSort: ", noteCardsInStacks.stacksNoteCards)
            setFirstCard();
        }
    }, [noteCardsInStacks, isNoteCardsInStackLoading]);

    return (
        <React.Fragment>
            <Modal
                isVisible={isModalOpen}
                closeModal={ () => closeModal() }
            >
                {modalContent}
            </Modal>
            <Button btnType={"Success"} clicked={ () => setModalOpen(true)} disabled={hasServerError}>STUDY</Button>
        </React.Fragment>
    )
}

export default NoteCards;