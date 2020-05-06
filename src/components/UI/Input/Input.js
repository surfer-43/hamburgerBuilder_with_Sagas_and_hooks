import React from "react";

import classes from "./Input.css";

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];
    // let validationError = null;

    // if(props.invalid && props.shouldValidate && props.modified) {
    //     // validationError = <span className={classes.WarningMessage}>Please enter something valid for {props.elementConfig.placeholder} </span>
    //     validationError.push(classes.Invalid)
    // }

    /**
     * new check to see if I can get validation working as expected
     */
    if(props.shouldValidate && props.modified) {
        if(!props.invalid){
            inputClasses.push(classes.Invalid);
        } 
    }

    switch(props.elementType) {
        case ('input'):
            inputElement = (
                <div>
                    <input 
                        className={inputClasses.join(" ")} 
                        {...props.elementConfig} 
                        value={props.value} 
                        onChange={props.changed}
                    />
                    {/* validationError */}
                </div>
            );
            break;
        case ("textarea"):
            inputElement = (
                <textarea
                    className={inputClasses.join(' ')}
                    {...props.elementConfig}
                    value={props.value}
                    onChange={props.changed}
                />
            );
            break;
        
        case ("select"):
            inputElement = (
                <div>
                    <label className={classes.Label}>{props.value}</label>
                    <select 
                        className={inputClasses.join(" ")} 
                        value={props.value}
                        onChange={props.changed}
                    >
                        {props.elementConfig.options.map(option => {
                            return (
                                <option key={option.value} value={option.value} >{option.displayValue}</option>
                            )
                        })}
                    </select>
                </div>
            );
            break;

        default:
            inputElement = <input 
                className={inputClasses.join(" ")} 
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed}
                />;
            break;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.elementConfig.placeholder}</label>
            {inputElement}
        </div>
    )
}

export default input;