import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter, Link } from 'react-router-dom'
import {Dimmer, Loader, Segment} from 'semantic-ui-react'


import routeConfig from '../../../../../../config/route'

/* COMPONENTS */
import { Button } from 'semantic-ui-react'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import PaddedContainer from '../PaddedContainer'

import styled from 'styled-components'
import connect from "react-redux/es/connect/connect";
import { fetchTemplatesThumbnails } from '../../../../sagas/templates/actions'

/* UTIL */
import media from '../../../../../../config/media'

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

const mapStateToProps = (state, ownProps) => {
    return {
        thumbnails: state.PrivateReducer.templatesThumbnails.list,
        loading: state.PrivateReducer.templatesThumbnails.loading,
        selectedTemplate: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTemplates: () => dispatch(fetchTemplatesThumbnails())
    }
}


class TemplatesRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: this.props.selectedTemplate.loading,
            config: this.props.selectedTemplate.config
        }
        this.scrollable = null
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
            <PaddedContainer>
                <ThumbnailContainer ref={(container)=> this.scrollable = container}>
                    {
                        this.props.loading ?
                            <Dimmer active>
                                <Loader />
                            </Dimmer> :
                            this.props.thumbnails.map((key, i) => {
                                const Thumb = withRouter(
                                    ({history, ...rest}) => (
                                        <Thumbnail onClick={() => {
                                            this.props.selectTemplate(i)
                                        }}>
                                            <CompositionExtended>
                                                {
                                                    key.thumb ? (<ThumbJoke src={key.thumb} alt=""/>)
                                                        : i
                                                }{this.props.selectedTemplate.index==i && (this.props.selectedTemplate.loading ? 'loading' : (this.props.selectedTemplate.error ? '':'active'))}
                                            </CompositionExtended>
                                            <ThumbnailDescription>
                                                {key.desc}
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

        )
    }
}

const TemplateSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplatesRepresentation)

export default TemplateSelector
