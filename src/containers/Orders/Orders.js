import React, { useEffect } from "react";
import { connect } from 'react-redux';

import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from '../../store/actions/index';

import Spinner from '../../components/UI/Spinner/Spinner';
//  import classes from './Orders.css';

const orders = (props) => {
    const { onFetchOrders } = props;
    useEffect(() => {
        onFetchOrders(props.token, props.userId);
    }, [ onFetchOrders ]);

    
    let orders = <Spinner />;
    if(!props.loading){
        orders = props.orders.map( order => {
                return <Order key={order.id} ingredients={order.ingredients} price={order.price}/>
            });
            
    }
    
    return (
        <div>
            {orders}
        </div>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

const mapStateToProps = (state) => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(orders, axios));