import React, { useState } from "react";
import { connect } from 'react-redux';

import Button from "../../../components/UI/Button/Button";
import axios from '../../../axios-orders';
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { updateObj, formValidation } from '../../../shared/index';

import * as actionTypes from '../../../store/actions/index';

import classes from "./ContactData.css";

const contactData = (props) => {

    const [ orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Name'
            },
            value: "",
            validation: {
                required: true
            },
            isValid: false,
            modified: false
        },
        address: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your street address'
            },
            value: "",
            validation: {
                required: true
            },
            isValid: false,
            modified: false
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Zip Code'
            },
            value: "",
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5
            },
            isValid: false,
            modified: false
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: "",
            validation: {
                required: true
            },
            isValid: false,
            modified: false
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your email'
            },
            value: "",
            validation: {
                required: true,
                isEmail: true
            },
            isValid: false,
            modified: false
        },
        delivery: {
            elementType: 'select',
            elementConfig: {
                options: [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                ]
            },
            value: "fastest",
            validation: {},
            isValid: true
        }
    });

    const [ formIsValid, setFormIsValid ] = useState(false);

    const orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for(let id in orderForm) {
            formData[id] = orderForm[id].value;
        }

        const order = {
            ingredients: props.ings,
            price: props.price,
            formData: formData,
            userId: props.userId
        }    

        props.purchaseStartOrder(order, props.token);
        // sending the order information to the database only if 
        
    }

    const changeHandler = (event, id) => {

        const updatedFormElm = updateObj(orderForm[id], {
            value: event.target.value,
            isValid: formValidation(event.target.value, orderForm[id].validation),
            modified: true
        })
        const updatedOrderForm = updateObj(orderForm, {
            [id]: updatedFormElm
        });

        let formValidated = true;
        for( let inputIdentifier in updatedOrderForm) {
            formValidated = updatedOrderForm[inputIdentifier].isValid && formValidated;
        }

        setOrderForm(updatedOrderForm);
        setFormIsValid(formValidated);
    }

        const formElementArray = [];
        for( let key in orderForm) {
            formElementArray.push({
                id: key,
                config: orderForm[key]
            })
        }
        let form = (
                <form onSubmit={orderHandler}>
                    {formElementArray.map(elm => {
                        return (
                            <Input 
                                key={elm.id} 
                                elementType={elm.config.elementType} 
                                elementConfig={elm.config.elementConfig} 
                                value={elm.config.value} 
                                shouldValidate={elm.config.validation}
                                invalid={elm.config.isValid}
                                modified={elm.config.modified}
                                changed={(event) => {changeHandler(event, elm.id)}} 
                            />
                        )
                    })}
                    <Button 
                        btnType="Success"
                        disabled={!formIsValid}
                    >Order</Button>
                </form>
        );
        if (props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data:</h4>
                {form} 
            </div>
        );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        purchaseStartOrder: (orderData, token) => dispatch(actionTypes.purchaseOrder(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(contactData, axios));