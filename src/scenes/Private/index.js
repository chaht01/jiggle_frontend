import React from 'react'

/* COMPONENTS */
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom'
import { Icon, Popup, Card, Image, Segment, Header, Container } from 'semantic-ui-react'
import Button from '../../components/Button'
import { AppBar, AppContent } from '../../components/Layout'
import Logo from '../../components/Logo'
import Dashboard from './scenes/Dashboard'
import Asap from './scenes/Asap'

/* STYLES */
import styled from 'styled-components'

/* SERVICES */
import routeConfig from '../../config/route'
import * as actionType from '../../sagas/types'

/* ASSETS */
import image from '../../assets/images/image.png'
import connect from "react-redux/es/connect/connect";

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
`

const AuthButton = withRouter(({history, logout, ...rest}) =>{
    return (
        <Popup
            trigger={<Icon link size="large" color="grey" name="user circle outline"/>}
            position="bottom left"
            on="click"
        >
            <Button
                color="red"
                onClick={() => {
                    logout()
                    history.push(routeConfig.publicRoot)
                }}>
                <Icon name="log out"/>{' '}로그아웃
            </Button>
        </Popup>

    )
})

const CreateButton = () => {
    return (
        <Button compact size="small" color="blue" inverted
                as={Link}
                to={`${routeConfig.privateRoot}/asap`}
            >
            <Icon name="add"/>
            만들기
        </Button>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch({type: actionType.LOGOUT}),
    }
}

const PrivateRepresentation = ({match, logout}) => {
    return (
        <AppContainer>
            <AppBar>
                <Logo to={`${match.url}`}>jiggle</Logo>
                <Route exact path={`${match.url}`} component={CreateButton}/>
                <AuthButton logout={logout}/>
            </AppBar>
            <AppContent>
                <Switch>
                    <Route exact path={`${match.url}`} component={Dashboard}/>
                    <Route path={`${match.url}/asap`} component={Asap}/>
                    {/*<Route exact path={`${match.url}/:id(\\d+)`} component={ChartBuilder}/>*/}
                    <Route component={() => (<Redirect to={{pathname: match.url}}/>)}/>
                </Switch>
            </AppContent>
        </AppContainer>
    )
}

const Private = connect(
    null,
    mapDispatchToProps
)(PrivateRepresentation)

export default Private
