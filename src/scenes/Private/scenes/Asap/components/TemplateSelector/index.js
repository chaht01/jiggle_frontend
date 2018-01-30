import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import {Dimmer, Loader, Segment} from 'semantic-ui-react'


import routeConfig from '../../../../../../config/route'

/* COMPONENTS */
import { Button } from 'semantic-ui-react'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'

import styled from 'styled-components'
import connect from "react-redux/es/connect/connect";
import { fetchTemplatesThumbnails } from '../../../../sagas/templates/actions'


const ThumbnailContainer = styled.div`
    display: flex;
    position: relative;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    padding: 1rem 2rem;
`
const Thumbnail = styled.div`
    width: 15rem;
    margin: 1rem;
`
const CompositionExtended = styled(Composition)`
    text-align: center;
    font-weight: 800;
    font-size: 2rem;
    cursor: pointer;
    background: #f1f1f5;
`

const mapStateToProps = (state, ownProps) => {
    return {
        thumbnails: state.PrivateReducer.templatesThumbnails.list,
        loading: state.PrivateReducer.templatesThumbnails.loading,
        selectedTemplate: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplateIdx,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTemplates: () => dispatch(fetchTemplatesThumbnails())
    }
}

class TemplatesRepresentation extends React.Component{
    componentWillMount(){
        this.props.fetchTemplates()
    }
    render(){
        return (
            this.props.loading ?
                <FullPage>
                    <Dimmer inverted active>
                        <Loader />
                    </Dimmer>
                </FullPage>
                :
                <FullPage>
                    <ThumbnailContainer>
                        {
                            this.props.thumbnails.map((key, i) => {
                                const Thumb = withRouter(
                                    ({history, ...rest}) => (
                                        <Thumbnail onClick={() => {
                                            {/*history.push(`${routeConfig.privateRoot}/${i}`)*/}
                                            this.props.selectTemplate(i)
                                        }}>
                                            <CompositionExtended>{i}{this.props.selectedTemplate==i && 'active'}</CompositionExtended>
                                        </Thumbnail>
                                    ))
                                return (
                                    <Thumb key={i}/>
                                )
                            })
                        }
                    </ThumbnailContainer>
                </FullPage>
        )
    }
}

const TemplateSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(TemplatesRepresentation)

export default TemplateSelector
