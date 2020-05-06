/**
 * IMPORTANT - 
 * neede to install jest-cli globally using
 * yarn global add jest
 * Enzyme API: http://airbnb.io/enzyme/docs/api/
 * Jest Docs: https://facebook.github.io/jest/
 */
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// get the component to be tested
import NavItems from './NavItems';
import NavItem from './NavItem/NavItem';

/**
 * this connects enzyme to the project allowing us
 * to test isolated components in the project
 */
configure({adapter: new Adapter()});

describe('<NavItems />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<NavItems />);
    });

    it('should render 2 <NavItems /> elements if not authenticated', () => {
        expect(wrapper.find(NavItem)).toHaveLength(2);
    });

    it('should render 3 <NavItems /> elements if authenticated', () => {
        wrapper.setProps({authenticated: true});
        expect(wrapper.find(NavItem)).toHaveLength(3);
    });

    it('should render <NavItem link="/logout">Sign out</NavItem> element if authenticated', () => {
        wrapper.setProps({authenticated: true});
        expect(wrapper.contains(<NavItem link="/logout">Sign out</NavItem>)).toEqual(true);
    });
});