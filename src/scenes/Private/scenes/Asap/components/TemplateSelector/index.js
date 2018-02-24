import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter, Link } from 'react-router-dom'



import routeConfig from '../../../../../../config/route'

/* COMPONENTS */
import {Dimmer, Loader, Segment} from 'semantic-ui-react'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import Button from '../../../../../../components/Button'
import PaddedContainer from '../PaddedContainer'
import SectionFooter from '../SectionFooter'

import styled from 'styled-components'
import connect from "react-redux/es/connect/connect";
import { fetchTemplatesThumbnails } from '../../../../sagas/templates/actions'

/* UTIL */
import media from '../../../../../../config/media'
import {fetchTemplate} from "../../sagas/actions";

const ThumbnailContainer = styled(FullPage)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 1rem;
    align-content: start;
    grid-row-gap: 2rem;
    overflow: auto;
`
const Thumbnail = styled.div`
    display: block;
    border: 2px solid ${props => props.selected ? '#FA4D1E' : 'transparent'};
`
const ThumbnailDescription = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 3.4rem;
    color: #C7C8CA;
    background: #1C2021;
`
const CompositionExtended = styled(Composition)`
    text-align: center;
    font-weight: 800;
    font-size: 2rem;
    cursor: pointer;
    background: #2A2E2F;
    overflow: hidden;
`

const ThumbJoke = styled.img`
    position:relative;
    width: 100%; 
    top: 50%; 
    transform: translate(0, -50%) scale(1.5);
    opacity: 0.3;
    transition: all .5s;
    &:hover{
        transform: translate(0, -50%) scale(1);
        opacity: 1;
    }
`

const RealThumb = styled.div`
    position:relative;
    width: 100%; 
    height: 100%;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: 50%;
    background-color: #fff;
    opacity: 0.3;
    transition: all .5s;
    background-image: url(${props => props.thumb});
    &:after{
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: 50%;
        background-color: #fff;
        left: 0;
        top: 0;
        background-image: url(${props => props.animate});
        content:"";
        display: none;
    }
    &:hover{
        opacity: 1;
        &:after{
            display: block;
        }
    }
`

const mapStateToProps = (state, ownProps) => {
    return {
        thumbnails: state.PrivateReducer.templatesThumbnails.list,
        loading: state.PrivateReducer.templatesThumbnails.loading,
        selectedTemplate: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTemplates: () => dispatch(fetchTemplatesThumbnails()),
        selectTemplate: (idx, template) => {
            return dispatch(fetchTemplate({
                idx,
                template
            }))
        },

    }
}


class TemplatesRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            selected: -1,
            loading: this.props.selectedTemplate.loading,
            config: this.props.selectedTemplate.config,
            over: false
        }
        this.scrollable = null
        this.handleOver = this.handleOver.bind(this)
        this.confirmTemplate = this.confirmTemplate.bind(this)
    }
    handleWheelEvent(element, e){
        const dY = e.deltaY,
            currScrollPos = element.scrollTop,
            scrollableDist = element.scrollHeight - element.clientHeight
        if((dY>0 && currScrollPos >= scrollableDist) ||
            (dY<0 && currScrollPos <= 0)){
            e.preventDefault();
            e.stopPropagation();
            if(dY>0 && currScrollPos >= scrollableDist){
                this.props.activateSection(1)
            }
            return false;
        }
        e.stopPropagation();
    }
    handleOver(value){
        this.setState({over:value})
    }
    confirmTemplate(){
        this.props.selectTemplate(this.state.selected, this.props.thumbnails[this.state.selected])
    }
    componentWillMount(){
        this.props.fetchTemplates()
    }
    componentDidMount(){
        const ele = ReactDOM.findDOMNode(this.scrollable)
        ele.addEventListener('wheel', this.handleWheelEvent.bind(this, ele), {passive: false})
    }
    componentWillReceiveProps(nextProps){
        if(this.props.selectedTemplate.loading && !nextProps.selectedTemplate.loading && nextProps.selectedTemplate.error===null){
            setTimeout(()=>this.props.activateSection(1), 250)
        }
    }
    componentWillUnmount(){

    }
    render(){
        return (
            <React.Fragment>
                <PaddedContainer>
                    <ThumbnailContainer ref={(container)=> this.scrollable = container}>
                        {
                            this.props.loading ?
                                <Dimmer active>
                                    <Loader />
                                </Dimmer> :
                                this.props.thumbnails.map((template, i) => {
                                    const Thumb = withRouter(
                                        ({history, ...rest}) => (
                                            <Thumbnail onClick={() => {
                                                this.setState({selected: i})
                                            }} selected={i===this.state.selected}>
                                                <CompositionExtended>
                                                    {template.thumb ? (template.dummy ? <ThumbJoke src={template.thumb} alt=""/> : <RealThumb thumb={template.thumb} animate={template.animate}/>) : template.name}
                                                    {this.props.selectedTemplate.idx==i && (this.props.selectedTemplate.loading ?
                                                        <Dimmer active>
                                                            <Loader size='medium'>Loading</Loader>
                                                        </Dimmer>
                                                        : (this.props.selectedTemplate.error ? '':'active'))}
                                                </CompositionExtended>
                                                <ThumbnailDescription>
                                                    {template.desc}
                                                </ThumbnailDescription>
                                            </Thumbnail>
                                        ))
                                    return (
                                        <Thumb key={i}/>
                                    )
                                })
                        }
                    </ThumbnailContainer>
                </PaddedContainer>
                <SectionFooter>
                    <Button onClick={this.confirmTemplate} compact size="small" theme={{fg:'#fff', bg:'#FA4D1E'}} style={{width: '7.5rem'}} disabled={this.state.selected==-1}>
                        {this.state.selected!=-1 && this.props.selectedTemplate.loading ?
                            <Loader active inline size='mini'/>
                            : '확인'
                        }
                    </Button>
                </SectionFooter>
            </React.Fragment>
        )
    }
}

const TemplateSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplatesRepresentation)

export default TemplateSelector
