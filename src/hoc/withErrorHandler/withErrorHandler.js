/**
 * building a higher order component that will return errors to
 * any component that it wraps
 * Original implementation is going to wrap the BurgerBuilder component
 */

import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    console.log("working on the ErrorHandler HOC");
    return (props) => {
        const [ error, setError ] = useState(null);

        // create an axios interceptor for the request as well so that we can reset the error state on each request
        const reqInerceptor = axios.interceptors.request.use( req => {
            setError(null);
            return req;
        });

        // this interceptor looks only at the response and sets an error to the state
        /**
         * figure out what the exact parameters are that are being passed in
         * are they both functions? (seems like it)
         */
        const responseInterceptor = axios.interceptors.response.use( res => res, err => {
            setError(err);
        });

        useEffect( () => {

            /** 
             * if we return a function from the useEffect hook, it runs as a cleanup function
             * what we are doing here is just that, clean up the interceptors that we aren't using anymore
             */
            return () => {
                /**
                 * because the withErrorHandler component can wrap around many different 
                 * components, there could be many different interceptros that linger but aren't used
                 * This bit of code removes the specific versions of interceptors created so we don't have
                 * as much inactive code and memory leaks
                 */
                axios.interceptors.request.eject(reqInerceptor);
                axios.interceptors.response.eject(responseInterceptor);
            }
        }, [ reqInerceptor, responseInterceptor ]);

        const errorConfirmedHandler = () => {
            setError(null)
        }
        
        return (
            <Aux>
                <Modal 
                    modalClosed={errorConfirmedHandler}
                    show={error}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        )
        
    }
}

export default withErrorHandler;