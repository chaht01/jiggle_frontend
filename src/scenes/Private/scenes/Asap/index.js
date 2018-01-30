import React from 'react'
import { Route } from 'react-router-dom'

/* COMPONENTS */
import { Button } from 'semantic-ui-react'
import TemplateSelector from './components/TemplateSelector'
import Sheet from '../../components/Sheet'
import FullPage from '../../../../components/Layout/FullPage'
import SectionScroll from '../../../../components/SectionScroll'
import SectionScrollSection from '../../../../components/SectionScroll/SectionScrollSection'
import SectionScrollSpy from '../../../../components/SectionScroll/SectionScrollSpy'

/* STYLES */
import styled from 'styled-components'

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

const FooterStyled = styled.div`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 2rem;
    width: 100%;
    height: 64px;
    background: #3B3F44;
    bottom: 0;
    top: auto;
    color: #fff;
    transform: translateY(${props => props.visible ? 0: '100%'});
    transition: all .5s;
    z-index: 9999;
`

const Footer = ({activeAnchorLength, direction, ...rest}) => {
    return (
        <FooterStyled visible={activeAnchorLength>2}>
            <Button color="red">저장하기</Button>
            <Button color="yellow">추가작업</Button>
        </FooterStyled>
    )
}


const AsapRepresentation = ({match, selectedTemplate, dirtyData, selectTemplate, ...rest}) => {
    return (
        <SectionScroll active={selectedTemplate!=-1 ? 1: 0}>
            <SectionScrollSpy items={['템플릿 선택', '데이터 선택', '입력세부 조정']}/>
            <SectionScrollSection>
                <TemplateSelector selectTemplate={selectTemplate}/>
            </SectionScrollSection>
            { selectedTemplate!=-1 && <SectionScrollSection><Sheet/></SectionScrollSection> }
            { selectedTemplate!=-1 && dirtyData!==null && <SectionScrollSection><FullPage/></SectionScrollSection> }
            <Footer sectionScrollException/>
        </SectionScroll>
    )
}

const Asap = connect(
    mapStateToProps,
    mapDispatchToProps
)(AsapRepresentation)

export default Asap
