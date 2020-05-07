import React, { useEffect, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

// Rect.lazy is an async way to load the components when they are required
const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
})
const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
})
const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
})
// class App extends Component {
  const app = (props) => {

    useEffect(() => {
      props.tryAutoSignup();
    }, []);
    let routes = (
      <Switch>
        <Route path="/auth" render={(props) => <Auth {...props}/>} />
        <Route path="/" exact component={BurgerBuilder} /> 
        <Redirect to='/' />   
      </Switch>      
    )

    if(props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/checkout" render={(props) => <Checkout {...props}/>} />
          <Route path="/orders" render={(props) => <Orders {...props}/>} />
          <Route path="/logout" component={Logout} />
          <Route path="/auth" render={(props) => <Auth {...props}/>} />
          <Route path="/" exact component={BurgerBuilder} />    
        </Switch>       
      )
    }

    return (
      <div>
        <Layout>
          <Suspense fallback={<p>loading...</p>}>  
            {routes} 
          </Suspense>
        </Layout>
      </div>
    );
  // }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    tryAutoSignup: () => dispatch(actions.authCheckState())
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
