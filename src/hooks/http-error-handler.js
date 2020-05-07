import { useState, useEffect } from 'react';

export default ( httpClient ) => {
    const [ error, setError ] = useState(null);

    // create an axios interceptor for the request as well so that we can reset the error state on each request
    const reqInerceptor = httpClient.interceptors.request.use( req => {
        setError(null);
        return req;
    });

    // this interceptor looks only at the response and sets an error to the state
    /**
     * figure out what the exact parameters are that are being passed in
     * are they both functions? (seems like it)
     */
    const responseInterceptor = httpClient.interceptors.response.use( res => res, err => {
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
            httpClient.interceptors.request.eject(reqInerceptor);
            httpClient.interceptors.response.eject(responseInterceptor);
        }
    }, [ reqInerceptor, responseInterceptor ]);

    const errorConfirmedHandler = () => {
        setError(null)
    }

    /**
     * can return anything
     * doesn't have to be an array of 2 elements
     * could be a number, string, {}
     * or nothing at all 
     */ 
    return [
        error,
        errorConfirmedHandler
    ]
};