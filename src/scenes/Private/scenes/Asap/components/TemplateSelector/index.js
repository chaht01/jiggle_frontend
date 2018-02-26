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
    overflow: auto;
`
const Thumbnail = styled.div`
    cursor: pointer;
    display: block;
    position:relative;
    border: 2px solid ${props => props.selected ? '#FA4D1E' : 'transparent'};
    transition: all .2s;
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
            e.preventDefault();
            e.stopPropagation();
            if(dY>0 && currScrollPos >= scrollableDist){
                this.props.activateSection(1)
            }
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
    componentWillUnmount(){

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
                                        const colors = colorsByType(template.type)
                                        const color = colors[Object.keys(colors)[0]][0]
                                        const palette = colorToPalette(color, template.type, mask.mask)
                                        const theme = THEME.DARK
                                        const dummyMeta = {}
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
                                                        meta={dummyMeta}
                                                        color={palette}
                                                        theme={theme}

                                                        transitionActive={this.state.over==i}
                                                        autoPlay={true}
                                                    />
                                                    {this.props.selectedTemplate.idx == i && (this.props.selectedTemplate.loading ?
                                                    <Loader active inverted size='medium'></Loader>
                                                    : null)}
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
                    }
                </PaddedContainer>
                <SectionFooter>
                    <Button onClick={this.confirmTemplate} compact size="small" theme={{fg:'#fff', bg:'#FA4D1E'}} style={{width: '7.5rem'}} disabled={this.state.selected==-1}>
                        {this.state.selected!=-1 && this.props.selectedTemplate.loading ?
                            <Loader active inline inverted size='mini'/>
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
