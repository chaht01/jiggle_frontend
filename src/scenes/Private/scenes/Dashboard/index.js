import React from 'react'
import { Link } from 'react-router-dom'

import { Segment, Container, Header } from 'semantic-ui-react'
import Composition from '../../../../components/Composition'

import connect from "react-redux/es/connect/connect";
import styled from 'styled-components'


const DashboardConatiner = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
    background: #f1f1f5;
    padding: 2rem 3rem;
    min-height: 100%;
`
const History = styled(Segment)`
    display: flex;
    width: 100%;
    max-width: 720px !important;
    border-radius: 2px !important;
    border-color: #f1f1f5; !important;
    border-bottom: 2px solid #e1e1e7 !important;
    box-shadow: none !important;
    margin-bottom: 2rem !important;
`
const Thumb = styled.div`
    flex: 1;
    min-width: 140px;
    max-width: 240px;
    margin-bottom: 1rem;
`
const StyledComposition = styled(Composition)`
    background: #2d2d2d;
`
const Description = styled.div`
    display: flex;
    flex-direction: column;
    flex: 3;
    padding: 0.5rem 1rem;
    justify-content: space-between;
`

const mapStateToProps = (state, ownProps) => {
    return {
        historyList: [
            {title: '18 상반기 삼성 전자 주가 변동 자료',
            updated: new Date().toDateString()},
            {title: '18 상반기 삼성 전자 주가 변동 자료',
                updated: new Date().toDateString()},
            {title: '18 상반기 삼성 전자 주가 변동 자료',
                updated: new Date().toDateString()},
        ]
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}


const DashboardRepresentaion = ({match, historyList}) => {
    return (
        <DashboardConatiner>
            {historyList.map((history, i)=>(
                <History key={i}>
                    <Thumb>
                        <StyledComposition/>
                    </Thumb>
                    <Description>
                        <Header as='h1'>{history.title}</Header>
                        <Container fluid textAlign={'right'}>{history.updated}</Container>
                    </Description>
                </History>
            ))}
        </DashboardConatiner>
    )
}

const Dashboard = connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardRepresentaion)

export default Dashboard
