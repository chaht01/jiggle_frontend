import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter, Link } from 'react-router-dom'



import routeConfig from '../../../../../../config/route'

/* COMPONENTS */
import {Dimmer, Loader, Label} from 'semantic-ui-react'
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
import factory from '../../config/factory'
import Workspace from '../Workspace'
import * as _ from "lodash";
import {colorsByType, colorToPalette} from "../../config/common";
import {THEME} from "../../config/types";
import numeral from 'numeral'

const Msg = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    right: 0;
    top: 0;
    bottom:0;
    padding-bottom: 50px;
    color: #fff;
`

const ThumbnailContainer = styled(FullPage)`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 1rem;
    align-content: start;
    grid-row-gap: 2rem;
    padding-bottom: calc(50px + 10rem);
    overflow: auto;
`
const Thumbnail = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position:relative;
    border: 2px solid ${props => props.selected ? '#FA4D1E' : 'transparent'};
    transition: all .2s;
`
const ThumbnailDescription = styled.div`
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    // height: 3.4rem;
    // color: #C7C8CA;
    // background: #1C2021;
    background: #e1e1e4;
    color: #222;
    padding: .3rem .8rem;
    font-size: .85rem;
    line-height: 1.4;
    transition: all .25s;
`

ThumbnailDescription.TextSpan = styled.div`
    margin-top: .5rem;
    margin-bottom: .5rem;
`
ThumbnailDescription.Tag = styled(Label)`
    background: #A5ABB8 !important;
    color: #fff !important;
`


const mapStateToProps = (state, ownProps) => {
    return {
        thumbnails: state.PrivateReducer.templatesThumbnails.list,
        loading: state.PrivateReducer.templatesThumbnails.loading,
        error: state.PrivateReducer.templatesThumbnails.error,
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

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    let templates = stateProps.thumbnails.map((template, i)=>{
        if(template.placeholder){
            const mask = factory.mask(template.placeholder.data, [], template.placeholder.emphasisTarget)[template.type]()
            const colorsTabs = colorsByType(template.type)
            const randomColors = colorsTabs[Object.keys(colorsTabs)[0]]
            const color = randomColors[(i%parseInt(randomColors.length))]
            const palette = colorToPalette(color, template.type, mask.mask)
            const theme = THEME.DARK
            const dummyMeta = template.placeholder.meta
            let placeholder = Object.assign({}, template.placeholder, {mask, palette, theme})
            let ret = Object.assign({}, template, {placeholder})
            return ret
        }
    })
    return Object.assign({}, stateProps, dispatchProps, ownProps, {thumbnails:templates})

}

class TemplatesRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            selected: -1,
            loading: this.props.selectedTemplate.loading,
            config: this.props.selectedTemplate.config,
            thumb_width:0,
            over: -1
        }
        this.thumbNode = null
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
            if(dY>0 && currScrollPos >= scrollableDist){
                this.props.activateSection(1)
                return true;
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        e.stopPropagation();
    }
    handleOver(idx){
        this.setState({over:idx})
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
    componentDidUpdate(){
        if(this.scrollable!==null){
            const ele = ReactDOM.findDOMNode(this.scrollable)
            ele.addEventListener('wheel', this.handleWheelEvent.bind(this, ele), {passive: false})
        }
    }
    render(){
        return (
            <React.Fragment>
                <PaddedContainer>
                    {
                        this.props.loading ?
                            <Dimmer active>
                                <Loader />
                            </Dimmer> :
                            this.props.error ?
                                <Msg>알 수 없는 에러가 발생했습니다. 다시 시도해 보세요.</Msg>
                                :
                                <ThumbnailContainer ref={(container)=> this.scrollable = container}>
                                    {this.props.thumbnails.map((template, i) => {
                                        const mask = factory.mask(template.placeholder.data, [], template.placeholder.emphasisTarget)[template.type]()
                                        const Thumb = withRouter(
                                            ({history, ...rest}) => (
                                                <Thumbnail
                                                    onClick={() => {
                                                        this.setState({selected: i})
                                                    }}
                                                    onDoubleClick={()=>{
                                                        console.log('ff')
                                                        this.setState({selected: i}, this.confirmTemplate)
                                                    }}
                                                    selected={i === this.state.selected}
                                                    onMouseEnter={()=>this.handleOver(i)}
                                                    onMouseLeave={()=>this.handleOver(-1)}
                                                >
                                                    <Workspace
                                                        background="transparent"
                                                        width={`100%`}

                                                        templateType={template.type}
                                                        templateConfig={template}
                                                        safeMask={mask}
                                                        meta={template.placeholder.meta}
                                                        color={template.placeholder.palette}
                                                        theme={template.placeholder.theme}

                                                        transitionActive={this.state.over==i}
                                                        autoPlay={true}
                                                    />
                                                    {this.props.selectedTemplate.idx == i && (this.props.selectedTemplate.loading ?
                                                    <Loader active inverted size='medium'></Loader>
                                                    : null)}
                                                    <ThumbnailDescription>
                                                        <ThumbnailDescription.TextSpan>
                                                            {template.description}
                                                        </ThumbnailDescription.TextSpan>
                                                    </ThumbnailDescription>
                                                </Thumbnail>
                                            ))
                                        return (
                                            <Thumb key={i}/>
                                        )
                                    })
                                    }
                                </ThumbnailContainer>
                    }
                </PaddedContainer>
                <SectionFooter>
                    <Button onClick={this.confirmTemplate} compact size="small" theme={{fg:'#fff', bg:'#FA4D1E'}} style={{width: '8rem'}} disabled={this.state.selected==-1}>
                        {this.state.selected!=-1 && this.props.selectedTemplate.loading ?
                            <Loader active inline inverted size='mini'/>
                            : '다음'
                        }
                    </Button>
                </SectionFooter>
            </React.Fragment>
        )
    }
}

const TemplateSelector = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(TemplatesRepresentation)

export default TemplateSelector
