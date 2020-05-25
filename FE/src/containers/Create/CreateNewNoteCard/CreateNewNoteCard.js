
import React, { useState, useEffect, useCallback } from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { onErrorFunc } from '../../../hooks/useGraphQLErrors';

import { getStacks  } from '../../../queries';
import { createNoteCard as createNoteCardMutation, addNoteCardToStack } from '../../../mutations';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';

const CreateNewNoteCard = (props) => {
    // STATE
    const [hasServerError, setServerError] = useState(false);
    const [newNoteCardId, setNewNoteCardId] = useState("")
    const [formSubmissionStatus, setFormSubmissionStatus] = useState({
        completed: false,
        started: false
    });
    const [parentStackId, setParentStackId] = useState("");
    const [isPageReady, setPageReady] = useState(false);
    const [isModalOpen, setOpen] = useState(false);
    const [formControls, formControlsUpdate] = useState({
        question: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'question'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        },
        answer: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'answer'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        },
        select: {
            elementType: 'select',
            options: [],
            value: '',
            validation: {
                required: true,
                minLength: 1
            },
            valid: false,
            touched: false,
            elementConfig: {
                placeholder: "Select a stack"
            }
        }
    });

    // QUERIES AND MUTATIONS
    const { loading: isGetStacksLoading, error: stacksError, data: stacksData } = useQuery(getStacks, {
        errorPolicy: "all",
        onError: (error) => onErrorFunc(error, props.history.location.pathname, {
            type: "query",
            name: "getStacks"
        })
    });
    //ADD STACKID TO THIS MUTATION SO THAT YOU CAN ASSOCIATE STACK WITH CARD
    const [createNoteCard,
        { loading: isCreateNoteCardLoading, error: createNewNoteCardError, data: newNoteCardData }
    ] = useMutation(createNoteCardMutation, { 
        errorPolicy: "all",
        onError: (error) => onErrorFunc(error, props.history.location.pathname, {
            type: "mutation",
            name: "createNoteCardMutation"
        }),
    });

    const [addToStack,
        { loading: isAddtoStackLoading, error: addToStackError, data: addToStackData }
    ] = useMutation(addNoteCardToStack, { 
        errorPolicy: "all",
        onError: (error) => onErrorFunc(error, props.history.location.pathname, {
            type: "mutation",
            name: "addNoteCardToStack"
        })
    });



    // useEffects
    useEffect(() => {
        if(stacksError || createNewNoteCardError || addToStackError) {
            setServerError(true);
        }
    }, [stacksError, createNewNoteCardError, addToStackError]);

    useEffect(() => {
        if(!isGetStacksLoading && !isPageReady) {
            setPageReady(true);
        }

        //STORE THE PREVIOUS ID AND THEN COMPARE TO THE ID OF THE RETURNED NOTECARD DATA, ONLY PASS IF DIFFERENT
        if(!isCreateNoteCardLoading && newNoteCardData && newNoteCardData.createNoteCard.id !== newNoteCardId) {
            const noteCardId = newNoteCardData.createNoteCard.id;
            addToStack({ variables: { noteCardId: noteCardId, stackId: parentStackId}});
            setNewNoteCardId(noteCardId)
        }
        
        if(!isAddtoStackLoading && addToStackData && formSubmissionStatus.started && !formSubmissionStatus.completed) {
            setFormSubmissionStatus({
                started: false,
                completed: true
            });
        }
    }, [isGetStacksLoading, isCreateNoteCardLoading, newNoteCardData, isAddtoStackLoading, addToStackData, formSubmissionStatus]);

    useEffect(() => {
        if(stacksData) {
            const updatedControls = {
                ...formControls,
                select: {
                    ...formControls["select"],
                    options: stacksData.stacks.map(stack => {
                        return {id: stack.id, title: stack.title}
                    })
                }
            }
            formControlsUpdate(updatedControls);
        }
    }, [stacksData])
    
    //HELPER FUNCTIONS
    const checkValidity = (value, validation) => {
        let isValid = true;
        if (validation.required) {
            isValid = value.trim() !== "" && isValid;
        }
        if (validation.minLength) {
            isValid = value.length >= validation.minLength && isValid;
        }
        return isValid;
    };

    const inputChangedHandler = (event, controlName) => {
        event.preventDefault();
        const updatedControls = {
            ...formControls,
            [controlName]: {
                ...formControls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, formControls[controlName].validation),
                touched: true
            }
        }
        if(controlName === "select") {
            setParentStackId(event.target.value);
        }
        formControlsUpdate(updatedControls);
    }

    const clearInputs = () => {
        let clearedFormControls = { ...formControls};

        for (let key in clearedFormControls) {
            clearedFormControls[key].value = '';
            clearedFormControls[key].valid = false;
            clearedFormControls[key].touched = false;
        }

        setParentStackId("");

        formControlsUpdate(clearedFormControls);
    }
    
    const closeModal = () => {
        clearInputs();
        setFormSubmissionStatus({
            completed: false,
            started: false
        })
        setOpen(false);
    }

    const passedVerification = () => {
        let readyToSubmit = true;
        let verifiedFormControls = { ...formControls };
        for(const id in formControls) {
            const valid = checkValidity(formControls[id].value, formControls[id].validation) && readyToSubmit;
            if(!valid) {
                verifiedFormControls[id] = {
                    ...verifiedFormControls[id],
                    valid: valid,
                    touched: !valid
                }
                readyToSubmit = valid
            };
        }
        formControlsUpdate(verifiedFormControls);
        return readyToSubmit;
    }
    
    const formSubmit = (e) => {
        /* add verficiation to formsubmit */
        e.preventDefault();
        if(passedVerification()) {
            const currentformSubmissionStatus = { ...formSubmissionStatus }
            setFormSubmissionStatus({
                ...currentformSubmissionStatus,
                started: true
            });
            createNoteCard({ variables: { question: formControls.question.value, answer: formControls.answer.value } });
        }
    }

    const canSubmit = () => {
        let success = false;
        for(const control in formControls) {
            success = formControls[control].valid && formControls[control].touched && !success;
        }
        return !success;
    }


    let formElementsArray = [];
    for(let key in formControls) {
        formElementsArray.push({
            id: key,
            config: formControls[key]
        });
    }

    //set state of form controls inside of stacksSelectOnChange, that will trigger a re-render and the value will update in the element control too
    const formContents = formElementsArray.map((formElement, i) => {
            // debugger;
        switch (formElement.config.elementType) {
            case 'input':
                return (<Input
                    key={formElement.id}
                    type={formElement.config.elementConfig.type}
                    elementtype={formElement.config.elementType}
                    value={formElement.config.value}
                    invalid={(!formElement.config.valid).toString()}
                    shouldvalidate={formElement.config.validation.required.toString()}
                    touched={formElement.config.touched.toString()}
                    placeholder={formElement.config.elementConfig.placeholder}
                    onChange={(event) => inputChangedHandler(event, formElement.id)}
                />);
            case 'select':
                return (<Input 
                    key={`select-${i}`}
                    elementtype={formElement.config.elementType}
                    value={formElement.config.value}
                    invalid={(!formElement.config.valid).toString()}
                    shouldvalidate={formElement.config.validation.required.toString()}
                    touched={formElement.config.touched.toString()}
                    placeholder={formElement.config.elementConfig.placeholder}
                    onChange={(event) => inputChangedHandler(event, formElement.id)}
                    options={formElement.config.options}
                />);
            default:
                return null;
        }
    });

    const modalContent = useCallback(() => {
        let content = null;
        if(isPageReady && !formSubmissionStatus.started) {
            content = (
            <form onSubmit={(e) => formSubmit(e)}>
                {formContents}
                <Button btnType="Success" disabled={canSubmit()}>Submit</Button>
            </form>); 
        }

        if(formSubmissionStatus.started) {
            content = <Spinner />
        }
        if(formSubmissionStatus.completed){
            content = <h4>Notecard created successfully!</h4>;
        }
        return content;
    },[isPageReady, formSubmissionStatus, formContents]);

    // if no stacks make button a re-route to stacks in order to create one
    return (
        isPageReady ?
            <React.Fragment>
                <Modal
                    isVisible={isModalOpen}
                    closeModal={() => { closeModal() }}
                >
                    {modalContent()}
                </Modal>
                <Button btnType={"Success"} clicked={() => { setOpen(true) }} disabled={hasServerError}>ADD NOTE CARD</Button>
            </React.Fragment>
            :
            <Spinner />
    )
}

export default CreateNewNoteCard;