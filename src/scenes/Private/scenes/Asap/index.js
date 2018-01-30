import React from 'react'
import { Route } from 'react-router-dom'

/* COMPONENTS */
import TemplateSelector from './components/TemplateSelector'
import Sheet from '../../components/Sheet'
import FullPage from '../../../../components/Layout/FullPage'
import SectionScroll from '../../../../components/SectionScroll'
import SectionScrollSection from '../../../../components/SectionScroll/SectionScrollSection'
import SectionScrollTimeline from '../../../../components/SectionScroll/SectionScrollTimeline'

/* UTILS */
import connect from "react-redux/es/connect/connect";
import { selectTemplate } from './sagas/actions'


const mapStateToProps = (state, ownProps) => {
    return {
        selectedTemplate: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplateIdx,
        dirtyData: state.PrivateReducer.AsapReducer.procedureManager.dirtyData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectTemplate: (idx) => dispatch(selectTemplate(idx))
    }
}


const AsapRepresentation = ({match, selectedTemplate, dirtyData, selectTemplate, ...rest}) => {
    return (
        <SectionScroll active={0}>
            <SectionScrollSection>
                <TemplateSelector selectTemplate={selectTemplate}/>
            </SectionScrollSection>
            { selectedTemplate!=-1 && <SectionScrollSection><Sheet/></SectionScrollSection> }
            { selectedTemplate!=-1 && dirtyData!==null && <SectionScrollSection><FullPage/></SectionScrollSection> }
        </SectionScroll>
    )
}

const Asap = connect(
    mapStateToProps,
    mapDispatchToProps
)(AsapRepresentation)

export default Asap
