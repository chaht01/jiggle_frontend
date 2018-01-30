import React from 'react'

/* COMPONENTS */
import { Route, Link, Switch, Redirect } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { AppBar, AppContent } from '../../../components/Layout'
import Logo from '../../../components/Logo'

/* INLINE STYLE */
import styled from 'styled-components'
import media from '../../../config/media'

/* SERVICES */
import routeConfig from '../../../config/route'
import connect from "react-redux/es/connect/connect";

/* ASSETS */
import logo from '../../../assets/images/tool_logo.gif'
const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.userReducer.isAuthenticated,
    }
}

const HomeRepresentation = ({isAuthenticated, ...rest})=>{
    if(isAuthenticated){
        return (
            <Redirect to="/protected"/>
        )
    }else{
        return (
            <div>
                <AppBar>
                    <Logo to={routeConfig.publicRoot}>
                        <img src={logo} style={{height:'100%'}}/>
                    </Logo>
                    <Button compact color="yellow" as={Link} to={`${routeConfig.publicRoot}/sign`}>log in</Button>
                </AppBar>
                <AppContent>
                    <h1>Public page</h1>
                </AppContent>
            </div>
        )
    }
}

const Home = connect(
    mapStateToProps,
    null
)(HomeRepresentation)

export default Home
