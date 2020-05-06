// Enzyme API: http://airbnb.io/enzyme/docs/api/
// Jest Docs: https://facebook.github.io/jest/
import React from 'react';

// import testing elements
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// import component to test
import { BurgerBuilder } from './BurgerBuilder';
import BuildControls from "../../components/Burger/BuildControls/BuildControls"

// configure the enzime tests correctly
configure({adapter: new Adapter()});

// create test 
describe('<BurgerBuilder/>', () =>{
    let wrapper;
    beforeEach(() => {
        /**
         * initIngredients is a function called on componentDidMount
         * we need that as a prop in the test when the component is created
         */
        wrapper = shallow(<BurgerBuilder initIngredients={() => {}}/>)
    });

    it('should render <BuildControls /> when there are ingredients', () => {
        wrapper.setProps({ings: {salad: 0}});
        expect(wrapper.find(BuildControls)).toHaveLength(1);
    });
})