import React from 'react'
import Button from '../../../../../../components/Button'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import PaddedContainer from '../PaddedContainer'


import {chart0, chart1, chart2} from 'd3-reusable/src/data/bar-data'

import styled from 'styled-components'
import {parseBar} from "d3-reusable/src/parser/bar-parser";
import BarFactory from "d3-reusable/src/factory/bar-factory";

const PreviewContainer = styled.div`
    width: 60rem;
    margin: 0 auto;
`

const PreviewThumbnails = styled(Composition)`
    background: #fff;
`

const FooterStyled = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 2rem;
    width: 100%;
    height: 64px;
    background: #000001;
    left: 0;
    bottom: 0;
    top: auto;
    color: #fff;
`
const Footer = ({activeAnchorLength, direction, renderGIF, ...rest}) => {
    return (
        <FooterStyled>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} disabled={true}>저장하기</Button>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} onClick={(e)=>renderGIF()}>추가작업</Button>
        </FooterStyled>
    )
}
class Preview extends React.Component{
    constructor(props){
        super(props)
        this.renderGIF = this.renderGIF.bind(this)
    }
    renderGIF(){
        this.factory.recordTransition(this.node, [...this.charts])
    }
    init(){
        this.charts = [chart0, chart1, chart2]
        this.charts.forEach(chart => parseBar(chart));
        this.factory = new BarFactory();
        // const renderer = factory.renderChart();
        // renderer(this.node, props.charts[0]);
        const renderTransition = this.factory.renderTransition();
        // renderTransition(this.node, [...this.charts]);
    }
    componentDidMount(){
        this.init()
    }
    componentWillReceiveProps(nextProps){
        this.init()
    }
    render(){
        return (
            <PaddedContainer>
                <FullPage>
                    <PreviewContainer>
                        <PreviewThumbnails>
                            <svg style={{display: 'none'}} width="100%" height="100%" ref={node => this.node = node}></svg>
                            <div id="gif"/>
                        </PreviewThumbnails>
                    </PreviewContainer>
                    <Footer renderGIF={this.renderGIF}/>
                </FullPage>
            </PaddedContainer>

        )
    }

}

export default Preview
