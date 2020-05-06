import React, { Component } from "react";
import { connect } from 'react-redux';

import Button from "../../../components/UI/Button/Button";
import axios from '../../../axios-orders';
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { updateObj, formValidation } from '../../../shared/index';

import * as actionTypes from '../../../store/actions/index';

import classes from "./ContactData.css";

class ContactData extends Component {
    state = {
        orderForm: {
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
        },
        formIsValid: false,
    };

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};
        for(let id in this.state.orderForm) {
            formData[id] = this.state.orderForm[id].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            formData: formData,
            userId: this.props.userId
        }    

        this.props.purchaseStartOrder(order, this.props.token);
        // sending the order information to the database only if 
        
    }

    changeHandler = (event, id) => {

        const updatedFormElm = updateObj(this.state.orderForm[id], {
            value: event.target.value,
            isValid: formValidation(event.target.value, this.state.orderForm[id].validation),
            modified: true
        })
        const updatedOrderForm = updateObj(this.state.orderForm, {
            [id]: updatedFormElm
        });

        let formIsValid = true;
        for( let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].isValid && formIsValid;
        }

        this.setState({
            orderForm: updatedOrderForm,
            formIsValid: formIsValid
        })
    }

    render() {
        const formElementArray = [];
        for( let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
                <form onSubmit={this.orderHandler}>
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
                                changed={(event) => {this.changeHandler(event, elm.id)}} 
                            />
                        )
                    })}
                    <Button 
                        btnType="Success"
                        disabled={!this.state.formIsValid}
                    >Order</Button>
                </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data:</h4>
                {form} 
            </div>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));