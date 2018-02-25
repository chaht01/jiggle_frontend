import React from 'react'

/* COMPONENTS */
import { Route, Link, Switch, Redirect } from 'react-router-dom'
import Button from '../../../components/Button'
import { AppBar, AppContent } from '../../../components/Layout'
import Logo from '../../../components/Logo'

/* INLINE STYLE */
import styled from 'styled-components'
import media from '../../../config/media'

/* SERVICES */
import routeConfig from '../../../config/route'
import connect from "react-redux/es/connect/connect";

/* ASSETS */
import logo_white from '../../../assets/images/logo/jiggle_logo-01.png'
import logo_colored from '../../../assets/images/logo/jiggle_logo-02.png'
import wallVideo from '../../../assets/video/jiggle_wall.mp4'
import collabo from '../../../assets/images/main/tool_logo_black-01.png'
import * as actionType from "../../../sagas/types";

const LogoContainer = styled.div`
    display: inline-block;
    height: 100%;
    padding: 1.1rem 0;
    >img{
        height: 100%;
        margin-right: 1rem;
    }
`
const WallVideo = styled.video`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    overflow:hidden;
`

const ParentContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`
const Parent = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    clip: rect(0, auto, auto, 0);
    z-index:2;
`
const ParentContent = styled.div`
    position: relative;
    padding-top: 60px;
    min-height: 100%;
    background: #fff;
`
const Child = styled(AppBar)`
    position: fixed;
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: transform;
    perspective: 1000;
`
const Collabo = ParentContent.extend`
    display:flex;
    justify-content: center;
    align-items: center;
`
const CollaboHolder = styled.div`
    text-align: center;
    line-height: 1.5;
    font-size: 1.1rem;
    margin-top: -10rem;
`
CollaboHolder.ImageHolder = styled.div`
    width: 22rem;position: relative;margin-bottom: 0rem;
`
CollaboHolder.Image = styled.img`
display: block;
width: 100%;
margin: 0 auto;
position: relative;
`

const mapStateToProps = (state, ownProps) => {
    return {
        isAuthenticated: state.userReducer.isAuthenticated,
    }
}


const mapDispatchToProps = (dispatch) => { //TODO: temporary auto auth
    return {
        login: () => dispatch({type: actionType.LOGIN_REQUEST, user:'hello', password:'world'})
    }

}
const HomeRepresentation = ({isAuthenticated, login, ...rest})=>{
    if(isAuthenticated){
        return (
            <Redirect to="/protected"/>
        )
    }else{
        return (
            <React.Fragment>
                <ParentContainer>
                    <Parent>
                        <Child>
                            <Logo to={`${routeConfig.publicRoot}`}>
                                <LogoContainer>
                                    <img src={logo_white} alt="jiggle"/>
                                </LogoContainer>
                            </Logo>
                            <Button size="small" onClick={login} compact theme={{fg:'#FA4D1E', bg:'#fff'}}>로그인</Button>
                        </Child>
                    </Parent>
                    <ParentContent>
                        <WallVideo autoPlay muted loop>
                            <source src={wallVideo} type="video/mp4"></source>
                        </WallVideo>
                    </ParentContent>
                </ParentContainer>
                <ParentContainer>
                    <Parent>
                        <Child>
                            <Logo to={`${routeConfig.publicRoot}`}>
                                <LogoContainer>
                                    <img src={logo_colored} alt="jiggle"/>
                                </LogoContainer>
                            </Logo>
                            <Button size="small" onClick={login} compact theme={{fg:'#fff', bg:'#FA4D1E'}}>로그인</Button>
                        </Child>
                    </Parent>
                    <Collabo>
                        <CollaboHolder>
                            <CollaboHolder.ImageHolder>
                                <CollaboHolder.Image src={collabo}/>
                            </CollaboHolder.ImageHolder>
                            <div>Jiggle은 데이터 스토리텔링을 도와줍니다.</div>
                            <div>이제껏 기사에 쓰이는 도표는 겉치레에 지나지 않았죠.</div>
                            <div>딱딱한 그래프에 플롯과 주인공을 만들어 보세요.</div>
                            <div>Jiggle이 여러분의 이야기를 그려 드립니다.</div>
                        </CollaboHolder>

                    </Collabo>
                </ParentContainer>

            </React.Fragment>
        )
    }
}

const Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeRepresentation)

export default Home
