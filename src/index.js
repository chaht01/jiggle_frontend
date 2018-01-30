/* REACT CORE */
import React from 'react';
import ReactDOM from 'react-dom';

/* REACT DEPENDENCIES */
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Link, Redirect, withRouter, Switch } from 'react-router-dom'

/* STYLE */
import 'semantic-ui-css/semantic.min.css'
import 'typeface-roboto'
import './reset.css'
import './index.css'
import styled from 'styled-components'

/* COMPONENTS */
import { Home, Sign } from './scenes/Public'
import PrivateRoute from './scenes/Private/components/PrivateRoute'
import Private from './scenes/Private'


/* SERVICES */
import registerServiceWorker from './registerServiceWorker';
import store from './store'
import fakeAuth from './config/auth'




const NoMatch = () => {
    return (
        <div>No match</div>
    )
}

const Root = ({store}) => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/sign" component={Sign}/>
                    <PrivateRoute path='/protected' component={Private}/>
                    <Route component={()=>(<Redirect to={'/'}/>)}/>
                </Switch>
            </BrowserRouter>
        </Provider>
        )

}

ReactDOM.render(<Root store={store}/>, document.getElementById('root'));
registerServiceWorker();
