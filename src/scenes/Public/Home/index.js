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
import LogoTitle from '../../../assets/images/jiggle-01.png'
import LogoImage from '../../../assets/images/Untitled-27-01.png'

const LogoContainer = styled.div`
    height: 100%;
    padding: 1.1rem 0;
    >img{
        height: 100%;
        margin-right: 1rem;
    }
`
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
                        <LogoContainer>
                            <img src={LogoTitle} alt="jiggle"/>
                            <img src={LogoImage} alt="jiggle_logo"/>
                        </LogoContainer>
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
