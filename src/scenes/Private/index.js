import React from 'react'

/* COMPONENTS */
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom'
import { Icon, Popup, Loader, Card, Image, Segment, Header, Container } from 'semantic-ui-react'
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
import LogoImage from '../../assets/images/logo/jiggle_logo-02.png'
import LogoVideo from '../../assets/images/logo/red_logo.mp4'
import connect from "react-redux/es/connect/connect";



const AppContainer = styled.div`
    width: 100%;
    height: 100%;
    background: #0F1011;
`

const PrivateAppBar = styled(({width, ...rest})=> <AppBar width={width} {...rest}/>)`
    background-color: #17181C;
`

const PrivateAppContent = styled(({width, ...rest}) => <AppContent width={width} {...rest}/>)`
    background: #0F1011;
`

const LogoContainer = styled.div`
    display: inline-block;
    height: 100%;
    padding: 1.1rem 0;
    >img{
        height: 100%;
    }
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
        <Button compact size="small" theme={{fg:'#fff', bg:'#FA4D1E'}}
                as={Link}
                to={`${routeConfig.privateRoot}/asap`}
            >
            <Icon name="add"/>
            만들기
        </Button>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedTemplate: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate,
        dirtyData: state.PrivateReducer.AsapReducer.procedureManager.dirtyData,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch({type: actionType.LOGOUT}),
    }
}
const AutoSaver = ({loading, ...rest}) => {
    const StyledAutoSaver = styled.span`
        color: #61C584;
        border-radius: 100px;
        padding: .4rem ${loading ? '.4rem' : '1rem'};
        font-size: 14px;
        border: ${props => props.loading ? '1px solid #61C584' : 'none'};
        transition: all .5s;
        margin-right: 1rem;
    `
    return (
        <StyledAutoSaver loading={loading}>
            {
                loading ?
                    <Loader size='mini' active inline />
                    :
                    <span>저장완료 <Icon name='check'/></span>
            }
        </StyledAutoSaver>
    )
}

const PrivateRepresentation = ({match, logout, selectedTemplate, dirtyData}) => {
    return (
        <AppContainer>
            <PrivateAppBar>
                <Logo to={`${routeConfig.publicRoot}`}>
                    <LogoContainer>
                        <img src={LogoImage} alt="jiggle"/>
                        <video autoPlay playsInline="true" style={{height:'130%', marginTop:'-30%'}}><source type="video/mp4" src={LogoVideo}/></video>
                    </LogoContainer>
                </Logo>
                {/*<Route exact path={`${match.url}`} component={CreateButton}/>*/}
                <Route exact path={`${match.url}`} component={()=> {
                    return(
                        (selectedTemplate.config || selectedTemplate.loading) && <AutoSaver loading={selectedTemplate.loading || dirtyData.loading}/>
                    )}
                }/>

                {/*<AuthButton logout={logout}/>*/}
            </PrivateAppBar>
            <PrivateAppContent>
                <Switch>
                    <Route path={`${match.url}`} component={Asap}/>
                    {/*<Route exact path={`${match.url}/:id(\\d+)`} component={ChartBuilder}/>*/}
                    <Route component={() => (<Redirect to={{pathname: match.url}}/>)}/>
                </Switch>
            </PrivateAppContent>
        </AppContainer>
    )
}

const Private = connect(
    mapStateToProps,
    mapDispatchToProps
)(PrivateRepresentation)

export default Private
