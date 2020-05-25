import React, { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { createStack as createStackMutation } from '../../../mutations';
import { onErrorFunc } from '../../../hooks/useGraphQLErrors';

import Spinner from '../../../components/UI/Spinner/Spinner';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';

const CreateNewStack = (props) => {
    // STATE
    const [hasServerError, setServerError] = useState(false);
    const [isModalOpen, setOpen] = useState(false);
    const [modalContentStatus, setModalContentStatus] = useState(0)
    const [formControls, formControlsUpdate] = useState({
        stackTitle: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'stack title'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });

    // QUERIES AND MUTATIONS
    const [ createStack, 
        { loading: createStackMutationLoading, error: createStackMutationError, data: createStackData } 
     ] = useMutation(createStackMutation, {
        onError: (error) => onErrorFunc(error, props.history.location.pathname, {
            type: "mutation",
            name: "createStackMutation"
        }),
     })

    // useEffects
    useEffect(() => {
        if(createStackMutationError) {
            setServerError(true);
        }
        if(createStackMutationLoading) {
            setModalContentStatus(-1);
        }
        if(!createStackMutationLoading && createStackData) {
            setModalContentStatus(1);
        }
    }, [createStackMutationError, createStackData, createStackMutationLoading]);

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
        const updatedControls = {
            ...formControls,
            [controlName]: {
                ...formControls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, formControls[controlName].validation),
                touched: true
            }
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

        formControlsUpdate(clearedFormControls);
    }
    
    const closeModal = () => {
        clearInputs();
        setOpen(false);
        setModalContentStatus(0)
    }

    const formSubmit = (e) => {
        e.preventDefault();
        createStack({ variables: { title: formControls.stackTitle.value } });
    }


    let formElementsArray = [];
    for(let key in formControls) {
        formElementsArray.push({
            id: key,
            config: formControls[key]
        });
    }

    const formContents = formElementsArray.map((formElement, i) => {
        switch (formElement.config.elementType) {
            case 'input':
                return (<Input
                    key={formElement.id}
                    type={formElement.config.elementConfig.type}
                    elementtype={formElement.config.elementConfig.elementType}
                    value={formElement.config.value}
                    invalid={(!formElement.config.valid).toString()}
                    shouldvalidate={formElement.config.validation.required.toString()}
                    touched={formElement.config.touched.toString()}
                    placeholder={formElement.config.elementConfig.placeholder}
                    onChange={(event) => inputChangedHandler(event, formElement.id)}
                />);
            default:
                return null;
        }
    });

    const modalContent = useCallback(() => {
        let content = (
            <form onSubmit={(e) => formSubmit(e)}>
                {formContents}
                <Button btnType="Success">Submit Stack</Button>
            </form>); 

        //STORE THE PREVIOUS ID AND THEN COMPARE TO THE ID OF THE RETURNED NOTECARD DATA, ONLY PASS IF DIFFERENT
        if(modalContentStatus === -1) {
            content = <Spinner />
        }
        if(modalContentStatus === 1){
            content = <h4>Stack created successfully!</h4>;
        }
        return content;
    },[modalContentStatus, formContents]);

    // if no stacks make button a re-route to stacks in order to create one
    return (
        <React.Fragment>
            <Modal
                isVisible={isModalOpen}
                closeModal={() => { closeModal() }}
            >
                {modalContent()}
            </Modal>
            <Button btnType={"Success"} clicked={() => { setOpen(true) }} disbled={hasServerError}>Create Stack</Button>
        </React.Fragment>
    )
}

export default CreateNewStack;