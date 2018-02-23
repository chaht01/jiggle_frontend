import React from 'react'
import { Route } from 'react-router-dom'

/* COMPONENTS */
import { Loader } from 'semantic-ui-react'
import TemplateSelector from './components/TemplateSelector'
import DataConfigView from './components/DataConfigView'
import Meta from './components/Meta'
import Preview from './components/Preview'
import AppearanceController from './components/AppearanceController'
import FullPage from '../../../../components/Layout/FullPage'
import SectionScroll from '../../../../components/SectionScroll'
import SectionScrollSection from '../../../../components/SectionScroll/SectionScrollSection'
import SectionScrollSpy from '../../../../components/SectionScroll/SectionScrollSpy'

/* STYLES */
import styled from 'styled-components'

/* UTILS */
import connect from "react-redux/es/connect/connect";
import { fetchTemplate, clearAllProcedure } from './sagas/actions'
import media from '../../../../config/media'
import viewport from '../../../../config/viewport'


const mapStateToProps = (state, ownProps) => {
    return {
        selectedTemplate: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate,
        dirtyData: state.PrivateReducer.AsapReducer.procedureManager.dirtyData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearAsap: () => {
            return dispatch(clearAllProcedure())
        }
    }
}



const StyledSectionScroll = styled(SectionScroll)`
    background: #282b2e;
`
class AsapRepresentation extends React.Component{
    constructor(props){
        super(props)
    }
    componentWillUnmount(){
        const {clearAsap} = this.props
        clearAsap()
    }
    render(){
        const {selectTemplate, selectedTemplate, dirtyData} = this.props
        return (
            <StyledSectionScroll>
                <SectionScrollSpy items={['애니메이션 선택', '데이터 입력', '프리뷰']} spyHeight={'80px'}>
                </SectionScrollSpy>
                <SectionScrollSection>
                    <TemplateSelector/>
                </SectionScrollSection>
                { selectedTemplate.config!=null
                && <SectionScrollSection>
                    <Meta/>
                    <DataConfigView/>
                </SectionScrollSection> }
                { selectedTemplate.config!=null
                    &&
                    <SectionScrollSection>
                        <Preview/>
                    </SectionScrollSection>
                }
            </StyledSectionScroll>
        )
    }

}

const Asap = connect(
    mapStateToProps,
    mapDispatchToProps
)(AsapRepresentation)

export default Asap
