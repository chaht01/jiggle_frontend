import React from 'react'
import { Redirect } from 'react-router-dom'

/* COMPONENTS */
import { Segment, Input, Form, Container, Icon } from 'semantic-ui-react'
import Button from '../../../components/Button'

/* STYLES */
import styled from 'styled-components'

/* SERVICES */
import routeConfig from '../../../config/route'
import connect from "react-redux/es/connect/connect"
import * as actionType from '../../../sagas/types'


const PageContainer = styled.div`
    width: 100%;
    height: 100%;
    background: #e1e1e7;
    display: flex;
    justify-content: center;
    align-items: center;
`

const SignFormContainer = styled(Segment)`
    padding: 1rem 2rem;
    min-width: 20rem;
`

const OAuthBtn = styled(Button)`
    width: 100% !important;
    margin: 0 !important;
`

const GoogleBtn = OAuthBtn.extend`
    background-color: #db402c !important;
    color: #fff !important;
    &:hover{
        background-color: #BA3F30 !important;
    }
`

const mapStateToProps = (state, ownProps) => {
    return {
        loading: state.userReducer.loading,
        isAuthenticated: state.userReducer.isAuthenticated,
        redirectToReferrer: state.userReducer.redirectToReferrer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: () => dispatch({type: actionType.LOGIN_REQUEST, user:'hello', password:'world'}),
    }
}


class SignRepresentation extends React.Component {


    render(){
        const {from} = this.props.location.state || { from: {pathname: routeConfig.privateRoot}}
        if (this.props.redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }
        if (this.props.isAuthenticated){
            return (
                <Redirect to={routeConfig.privateRoot}/>
            )
        }
        return(
            <PageContainer>
                <SignFormContainer>
                    <Form>
                        <Form.Field required>
                            <label>Email</label>
                            <Input type="text"/>
                        </Form.Field>
                        <Form.Field required>
                            <label>Password</label>
                            <Input type="password"/>
                        </Form.Field>
                        <OAuthBtn>Sign up</OAuthBtn>
                        <Container fluid textAlign="center">or</Container>
                        <GoogleBtn onClick={this.props.login} type="submit"
                                   loading={this.props.loading}
                                    disabled={this.props.loading}>
                            <Icon name="google"/>
                            <span>Sign in with Google</span>
                        </GoogleBtn>
                    </Form>
                    from{from.pathname}

                </SignFormContainer>
            </PageContainer>
        )
    }
}

const Sign = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignRepresentation)



export default Sign
