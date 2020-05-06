/**
 * building a higher order component that will return errors to
 * any component that it wraps
 * Original implementation is going to wrap the BurgerBuilder component
 */

import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    
    return class extends Component {
        state = {
            error: null
        }

        // componentWillMount() {
        componentWillMount() {
            // create an axios interceptor for the request as well so that we can reset the error state on each request
            this.reqInerceptor = axios.interceptors.request.use( req => {
                this.setState({
                    error: null
                });
                return req;
            })

            // this interceptor looks only at the response and sets an error to the state
            /**
             * figure out what the exact parameters are that are being passed in
             * are they both functions? (seems like it)
             */
            this.responseInterceptor = axios.interceptors.response.use( res => res, error => {
                this.setState({
                    error: error
                });
            })
        }

        componentWillUnmount() {
            /**
             * because the withErrorHandler component can wrap around many different 
             * components, there could be many different interceptros that linger but aren't used
             * This bit of code removes the specific versions of interceptors created so we don't have
             * as much inactive code and memory leaks
             */
            axios.interceptors.request.eject(this.reqInerceptor);
            axios.interceptors.response.eject(this.responseInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({
                error: null
            })
        }

        render () {
            return (
                <Aux>
                    <Modal 
                        modalClosed={this.errorConfirmedHandler}
                        show={this.state.error}>
                        {/* if there is an error in the state print the error otherwise print null */}
                        {this.state.error? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            )
        };
    }
}

export default withErrorHandler;