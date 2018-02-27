import React from 'react'

/* COMPONENTS */
import { Route, Link, Switch, Redirect } from 'react-router-dom'
import Button from '../../../components/Button'
import { AppBar, AppContent } from '../../../components/Layout'
import Logo from '../../../components/Logo'
import Workspace from "../../Private/scenes/Asap/components/Workspace"
import Slider from 'react-slick'

/* INLINE STYLE */
import styled from 'styled-components'
import media from '../../../config/media'
import viewport from '../../../config/viewport'

/* SERVICES */
import routeConfig from '../../../config/route'
import connect from "react-redux/es/connect/connect"
import {fetchTemplatesThumbnails} from "../../Private/sagas/templates/actions"
import factory  from "../../Private/scenes/Asap/config/factory"
import {colorsByType, colorToPalette} from "../../Private/scenes/Asap/config/common"
import {THEME} from "../../Private/scenes/Asap/config/types"
import * as actionType from "../../../sagas/types"

/* ASSETS */
import logo_white from '../../../assets/images/logo/jiggle_logo-01.png'
import logo_colored from '../../../assets/images/logo/jiggle_logo-02.png'
import wallVideo from '../../../assets/video/jiggle_wall.mp4'
import collabo from '../../../assets/images/main/tool_logo_black-01.png'

import * as images from './images'

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
    transform: translateY(${props => props.yOffset> props.docHeight ? '-30' : -30*props.yOffset/props.docHeight}%)
`

const ParentContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    font-family: 'Gyeongi';
    font-weight: 300;
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
    pointer-events: none;
`
const ParentContent = styled.div`
    position: relative;
    height: 100%;
    overflow-x:hidden;
    background: #F7F7F7;
`
const Child = styled(AppBar)`
    position: fixed;
    left: 50%;
    transform: translateZ(0) translateX(-50%);
    backface-visibility: hidden;
    will-change: transform;
    perspective: 1000;
    pointer-events: all;
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

const SliderContent = ParentContent.extend`
    background: #fff;
`

const mapStateToProps = (state, ownProps) => {
    return {
        thumbnails: state.PrivateReducer.templatesThumbnails.list,
        isAuthenticated: state.userReducer.isAuthenticated,
    }
}


const mapDispatchToProps = (dispatch) => { //TODO: temporary auto auth
    return {
        login: () => dispatch({type: actionType.LOGIN_REQUEST, user:'hello', password:'world'}),
        fetchTemplates: () => dispatch(fetchTemplatesThumbnails()),
    }

}
class HomeRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.descriptions = [
            {title:'1. 애니메이션 선택',
                desc: ['만들고자 하는 애니메이션 템플릿을 선택합니다.', '표현 목적에 따라 그래프 선택이 가능합니다.'],
                list: [
                    {
                        icon: images['main1_icon1'],
                        value: '바, 라인 그래프 설명'
                    },
                    {
                        icon: images['main1_icon2'],
                        value: '용도에 따른 선택 가능'
                    },
                    {
                        icon: images['main1_icon3'],
                        value: '원하는 애니메이션 프리뷰 가능'
                    },
                ],
                preview: images['main1_before']

            },
            {title:'2. 데이터 입력',
                desc: ['만들고자하는 그래프의 데이터를 입력하는 단계입니다.', '제목 자료출처 등 필수적인 정보도 합께 작성합니다.'],
                list: [
                    {
                        icon: images['main2_icon1'],
                        value: '엑셀 데이터에서 복사 / 붙여넣기'
                    },
                    {
                        icon: images['main2_icon2'],
                        value: '제목, 단위, 출처, 만든사람, X/Y 축 정보 기입'
                    },
                    {
                        icon: images['main2_icon3'],
                        value: '즉시 프리뷰 확인'
                    },
                ],
                preview: images['main2']

            },
            {title:'3. 프리뷰 확인 및 저장',
                desc: ['자신이 원하는 애니메이션이 맞는지 확인합니다.', '오른쪽 패널에서 추가 작업을 완료하고 저장합니다.'],
                list: [
                    {
                        icon: images['main3_icon1'],
                        value: '다양한 컬러 테마'
                    },
                    {
                        icon: images['main3_icon2'],
                        value: '기업 로고, 이미지 삽입 기능'
                    },
                    {
                        icon: images['main3_icon3'],
                        value: 'gif/jpg로 저장'
                    },
                ],
                preview: images['main3']

            }
        ]
        this.handleScroll = this.handleScroll.bind(this)
        this.onSelectSlide = this.onSelectSlide.bind(this)
        this.scrollTop = 0
        this.state = {
            docHeight: 0,
            contentOffset: 0,
            focusedSlide: 0
        }
    }

    componentWillMount(){
        this.props.fetchTemplates()
    }

    handleScroll(e){
        if(typeof window.pageYOffset!= 'undefined'){
            //most browsers except IE before #9
            this.setState({scrollTop : window.pageYOffset})
        }
        else{
            var B= document.body; //IE 'quirks'
            var D= document.documentElement; //IE with doctype
            D= (D.clientHeight)? D: B;
            this.setState({scrollTop : D.scrollTop})
        }
    }

    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll, false)
        const width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth
        const height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight
        this.setState({
            docHeight: height,
            contentOffset: height+(width*9/16)
        })
    }

    onSelectSlide(idx){
        this.setState({focusedSlide:idx})
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll)
    }
    render(){
        const {isAuthenticated, login, ...rest} = this.props
        const descriptions = this.descriptions
        return (
            <React.Fragment>
                <ParentContainer style={{height: 'auto', paddingTop:'56.25%'}}>
                    <Parent>
                        <Child>
                            <Logo to={`${routeConfig.publicRoot}`}>
                                <LogoContainer>
                                    <img src={logo_white} alt="jiggle"/>
                                </LogoContainer>
                            </Logo>
                            <Button size="small" as={Link} to={`${routeConfig.privateRoot}`} nomargin rounded compact inverted theme={{fg:'#fff', bg:'#fff'}}>시작하기</Button>
                        </Child>
                    </Parent>
                    <ParentContent>
                        <WallVideo autoPlay muted loop
                                   style={{
                                       transform: `translateY(${this.state.scrollTop> this.state.docHeight ? '-30' : -30*this.state.scrollTop/this.state.docHeight}%)`
                                   }}
                        >
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
                            <Button size="small" as={Link} to={`${routeConfig.privateRoot}`} nomargin rounded compact inverted theme={{fg:'#FA4D1E', bg:'#FA4D1E'}}>시작하기</Button>
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


                {descriptions.map((desc, i) => {
                    return (
                        <ParentContainer key={i}>
                            <Parent>
                                <Child>
                                    <Logo to={`${routeConfig.publicRoot}`}>
                                        <LogoContainer>
                                            <img src={logo_colored} alt="jiggle"/>
                                        </LogoContainer>
                                    </Logo>
                                    <Button size="small" as={Link} to={`${routeConfig.privateRoot}`} nomargin rounded compact inverted theme={{fg:'#FA4D1E', bg:'#FA4D1E'}}>시작하기</Button>
                                </Child>
                            </Parent>
                            <ParentContent>
                                <Step reverse={i%2==0}>
                                    <PreviewContainer
                                        left={i%2==1} right={i%2==0}
                                        style={{
                                            transform: `translateY(${this.state.scrollTop> this.state.docHeight*(1+i)+this.state.contentOffset ? '-20' : this.state.scrollTop < this.state.docHeight*(i-1)+this.state.contentOffset ? '20' : -20*(this.state.scrollTop-(this.state.docHeight*(i)+this.state.contentOffset))/(this.state.docHeight)}%)`
                                        }}>
                                        <Preview src={desc.preview}>
                                            {i==0 &&
                                                <ActiveTemplate
                                                    active={
                                                        this.state.scrollTop> this.state.docHeight*(i-0.5)+this.state.contentOffset
                                                    }
                                                />
                                            }
                                            {i==2 &&
                                            <ActivePreview
                                                active={
                                                    this.state.scrollTop> this.state.docHeight*(i-0.5)+this.state.contentOffset
                                                }
                                            />
                                            }
                                        </Preview>
                                    </PreviewContainer>
                                    <StepDescription
                                        left={i%2==1} right={i%2==0}>
                                        <StepDescription.Title
                                            style={{
                                                transform: `translateY(${this.state.scrollTop> this.state.docHeight*(1+i)+this.state.contentOffset ? '-100' : this.state.scrollTop < this.state.docHeight*(i-1)+this.state.contentOffset ? '100' : -100*(this.state.scrollTop-(this.state.docHeight*(i)+this.state.contentOffset))/(this.state.docHeight)}%)`
                                            }}
                                        >{desc.title}</StepDescription.Title>
                                        <StepDescription.Desc>
                                            {desc.desc.map((line,k) =>
                                                <div key={k}>{line}</div>
                                            )}
                                        </StepDescription.Desc>
                                        {desc.list.map((l, j) =>
                                            <StepDescription.List key={j}
                                                                  icon={l.icon}
                                                                  style={{
                                                                      transform: `translateY(${this.state.scrollTop> (this.state.docHeight*(1+i)+this.state.contentOffset+j*20) ? '0' : this.state.scrollTop < (this.state.docHeight*(i-1)+this.state.contentOffset+j*20) ? '30' : -30*(this.state.scrollTop-(this.state.docHeight*(i)+this.state.contentOffset+j*20))/(this.state.docHeight)}%)`,
                                                                      opacity: `${this.state.scrollTop> (this.state.docHeight*(i)+this.state.contentOffset+j*20) ? '1' : this.state.scrollTop < (this.state.docHeight*(i-1)+this.state.contentOffset+j*20) ? '0' : 1-(-1*(this.state.scrollTop-(this.state.docHeight*(i)+this.state.contentOffset+j*20))/(this.state.docHeight))}`
                                                                  }}>
                                                {l.value}
                                            </StepDescription.List>
                                        )}
                                    </StepDescription>
                                </Step>
                            </ParentContent>
                        </ParentContainer>
                    )
                })}
                <ParentContainer>
                    <Parent>
                        <Child>
                            <Logo to={`${routeConfig.publicRoot}`}>
                                <LogoContainer>
                                    <img src={logo_colored} alt="jiggle"/>
                                </LogoContainer>
                            </Logo>
                            <Button size="small" as={Link} to={`${routeConfig.privateRoot}`} nomargin rounded compact inverted theme={{fg:'#FA4D1E', bg:'#FA4D1E'}}>시작하기</Button>
                        </Child>
                    </Parent>
                    <SliderContent>
                        <Slider
                            dots={false}
                            speed={500}
                            centerMode={true}
                            focusOnSelect={true}
                            adaptiveHeight={true}
                            slidesToShow={3}
                            afterChange={this.onSelectSlide}
                            style={{height:'100vh'}}
                            responsive={[{breakpoint:viewport.tablet, settings: {slidesToShow:1, dots:true}}]}
                        >
                            {this.props.thumbnails.map((template,c_i)=>{
                                const mask = factory.mask(template.placeholder.data, [], template.placeholder.emphasisTarget)[template.type]()
                                const colors = colorsByType(template.type)
                                const color = colors[Object.keys(colors)[0]][0]
                                const palette = colorToPalette(color, template.type, mask.mask)
                                const theme = THEME.DARK
                                const dummyMeta = template.placeholder.meta
                                return(
                                    <Viewport key={c_i} active={this.state.focusedSlide==c_i}>
                                        <Viewport.Title>
                                            {template.placeholder.paper.title}
                                        </Viewport.Title>
                                        <Workspace
                                            background="transparent"
                                            width={`100%`}

                                            templateType={template.type}
                                            templateConfig={template}
                                            safeMask={mask}
                                            meta={dummyMeta}
                                            color={palette}
                                            theme={theme}

                                            transitionActive={this.state.focusedSlide==c_i}
                                            autoPlay={true}
                                        />
                                        <Viewport.Description>
                                            {template.placeholder.paper.contents}
                                        </Viewport.Description>
                                    </Viewport>)
                            })}

                        </Slider>
                        <EndFooter>
                            <Button size="large" as={Link} to={`${routeConfig.privateRoot}`} nomargin compact theme={{fg:'#fff', bg:'#FA4D1E'}}>시작하기</Button>
                        </EndFooter>
                    </SliderContent>
                </ParentContainer>
            </React.Fragment>
        )
    }
}

const EndFooter = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    padding-bottom: 2rem;
    width: 100%;
    top: auto;
    bottom: 0;
    height: 30vh;
    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%); 
`

const Viewport = styled.div`
    position: relative;
    transform: scale(${props => props.active? 1.5: 0.9});
    ${media.tablet`
        transform: scale(${props => props.active? 1: 0.9});`}
    opacity: ${props => props.active? 1: 0.7};
    z-index: ${props => props.active ? 2 : 1};
    transition: all .5s;
`

Viewport.Title = styled.div`
    position: absolute;
    font-size: 20px;
    transform: translateY(-100%);
    padding-bottom: 10px;
    width: 100%;
    text-align: center;
`
Viewport.Description = styled.div`
    position: absolute;
    font-size: 8px;
    bottom:0;
    transform: translateY(100%);
    padding: 10px 20px;
    line-height: 1.4;
    color: #65696A;
    width: 100%;
    text-align: left;
`

const ActivePreview = styled.div`
    position: absolute;
    display:block;
    width: 418px;
    top: 54.5%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow:hidden;
    &:before{
        content: '';
        display: block;
        position: relative;
        width: 100%;
        padding-top: 56.25%;
        background: #F7F7F7;
        transition: all 1s cubic-bezier(0.86, 0, 0.07, 1);
        transition-delay: .1s;
        transform: translate(${props => props.active ? '100%': 0});
    }
    
    ${media.tablet`
        width: ${418/766*100}%;
    `}
`

const ActiveTemplate = styled.div`
    position: absolute;
    display:block;
    width: 207px;
    top: 39.5%;
    left: 49.3%;
    transform: translate(-50%, -50%) scale(${props => props.active ? 1: 0.5});
    opacity: ${props => props.active ? 1: 0};
    transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 2.55);
    
    &:before{
        content: '';
        display: block;
        position: relative;
        width: 100%;
        padding-top: ${525/865*100}%;
        background-image: url(${images.main1_after});
        background-size: contain;
    }
    
    ${media.tablet`
        width: ${207/766*100}%;
    `}
`

const Step = styled.div`
    display: flex;
    ${media.tablet`flex-direction: column;`}
    align-items: center;
    position: relative;
    font-family: 'Gyeongi';
    font-weight: 300;
    left: 50%;
    top: 50%;
    transform: translate(${props => props.reverse ? '-45':'-55'}%, -50%);
    ${media.tablet`transform: translate(-50%, -50%);`}
    max-width: 1366px;
    justify-content: flex-start;
    ${props => props.reverse ? 'flex-direction: row-reverse;' :''}
    &:before, &:after{
        display:block;
        content:'';
        position:relative;
        clear: both;
    }
`

const PreviewContainer = styled.div`
    position: relative;
   
    width: 766px;
    flex-shrink:0;
    ${props => props.left ? 'margin-right: 79px;':''}
    ${props => props.right ? 'margin-left: 79px;':''}
    ${media.tablet`
        width: 80%;
        margin-left: 0;
        margin-right: 0;
        margin-bottom: -10vw;
        ${props => props.left ? 'float:left;margin-left: -40vw;':''}
        ${props => props.right ? 'float:right;margin-right: -40vw;':''}
    `}
`

const Preview = styled.div`
    width: 100%;
    padding-top: ${459/766*100}%;
    background-image: url(${props=>props.src});
    background-size: cover;
`

const StepDescription = styled.section`
    position:relative;
    width: 460px;
    padding-top: 59px;
    flex-shrink:0;
    z-index:1;
    ${media.tablet`
        width: auto;
        margin-top:5vw;
        padding-left: 5vw;
        padding-right: 5vw;
    `}
    &:before{
        font-size: 16px;
        position: absolute;
        top:0;
        display: block;
        content: '1-2-3 단계 중'
    }
`
StepDescription.Title = styled.div`
    font-size: 50px;
    ${media.laptop`
        font-size: 10vw;
    `}
    font-weight: 700;
    margin-bottom: 30px;
`

StepDescription.Desc = styled.div`
    font-size: 16px;
    >*{
        display: block;
        margin-bottom: 14px;
        &:last-of-type{
            margin-bottom: 0;
        }
    }
    margin-bottom: 37px;
`
StepDescription.List = styled.div`
    &:before{
        content:'';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 23px;
        height: 23px;
        background-image: url(${props=>props.icon});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: 50% 50%;
    }
    position: relative;
    margin-bottom: 25px;
    padding-left: 37px;
`

const Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeRepresentation)

export default Home
