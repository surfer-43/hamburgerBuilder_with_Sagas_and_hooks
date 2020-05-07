/**
 * building a higher order component that will return errors to
 * any component that it wraps
 * Original implementation is going to wrap the BurgerBuilder component
 */

import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

/**
 * example of custom hook to handle any
 * http request errors
 */
import useHTTPErrorHandler from '../../hooks/http-error-handler'

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [ error, clearErrors ] = useHTTPErrorHandler(axios);
        
        return (
            <Aux>
                <Modal 
                    modalClosed={clearErrors}
                    show={error}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        )
        
    }
}

export default withErrorHandler;