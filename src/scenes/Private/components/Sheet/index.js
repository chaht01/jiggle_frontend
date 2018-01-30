import React from 'react'

/* COMPONENTS */
import { Input, Segment } from 'semantic-ui-react'
import Handson from '../../../../components/Handson'
import FullPage from '../../../../components/Layout/FullPage'

import styled from 'styled-components'

import connect from 'react-redux/es/connect/connect'



const mapStateToDispatch = (state, ownProps) => {
    return {
        handsontableData: [
            ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""]
        ]
    }
}

const SheetRepresentation = ({handsontableData}) => {
    const size = {
        width: 820,
        height: 520,
        padding:{
            top: 1,
            left: 1.6,
        }
    }
    const SheetContainer = styled.div`
        padding: ${size.padding.top}rem ${size.padding.left}rem;
        border: 1px solid #e1e1e7;
        background: #f1f1f5;
        border-radius: 2px;
        width: calc(${size.width}px + ${size.padding.left * 2}rem);
    `
    return(
        <FullPage>
            <SheetContainer>
                <Handson data={handsontableData}
                         colHeaders={true}
                         rowHeaders={true}
                         width={size.width}
                         height={size.height}
                         colWidths="80"
                         rowHeights="23"/>
            </SheetContainer>
            <Input/>
        </FullPage>
    )
}

const Sheet = connect(
    mapStateToDispatch,
    null
)(SheetRepresentation)

export default Sheet
