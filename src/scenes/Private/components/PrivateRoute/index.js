import React from 'react'

/* COMPONENTS */
import { Route, Link, Switch, Redirect } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { AppBar, AppContent } from '../../../../components/Layout'

/* SERVICES */
import routeConfig from '../../../../config/route'
import connect from 'react-redux/es/connect/connect'

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.userReducer.isAuthenticated,
    }
}

const PrivateRouteRepresentation = ({component: Component, isAuthenticated, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isAuthenticated ? (
                    <Component {...props}/>
                ) : (
                    <Redirect to={{
                        pathname: `${routeConfig.publicRoot}/sign`,
                        state: {from: props.location}
                    }}/>
                )
        )}/>
    )

}

const PrivateRoute = connect(
    mapStateToProps,
    null
)(PrivateRouteRepresentation)

export default PrivateRoute
