
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { useQuery } from '@apollo/react-hooks';

import { getStacks } from '../../queries';

import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/Modal/Modal';
import classes from './Stacks.module.css';

const Stacks = (props) => {
    const { loading, error, data } = useQuery(getStacks);
    let history = useHistory();

    const [isModalOpen, setModalOpenState] = useState(false);

    useEffect(() => {
        if(error) {
            setModalOpenState(true)
        }
    }, [error]);

     const routeToNoteCards = (id) => {
         history.push({
             pathname: '/notecards',
             search: `?stackId=${id}`
         });
     }

    const content = () => {
        if(error) {
            return <Modal 
                isVisible={isModalOpen}
                closeModal={() => setModalOpenState(false)}
            >
                <h1>ERROR!!!</h1>
                <h5>{error.message}</h5>
            </Modal>
        }
        return !loading ? 
            <div className={classes.StacksContainer}>
                {data.stacks.map((stack, i) => {
                    return (
                        <div className={classes.StackItem} key={`${stack.id}-${i}`} onClick={() => routeToNoteCards(stack.id)}>
                            <h4>{stack.title}</h4>
                        </div>);
                })}
            </div>    
            :
            <Spinner />
    }

    return (
        <React.Fragment>
            {content()}
        </React.Fragment>
    )
}

export default Stacks;