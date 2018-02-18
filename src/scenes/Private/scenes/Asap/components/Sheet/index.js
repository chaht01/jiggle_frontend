import React from 'react'

/* COMPONENTS */
import FullPage from '../../../../../../components/Layout/FullPage'
import {BarSheet} from './factory'

import styled from 'styled-components'
import './style.css'

import { defaultDummyData, getRangeOfValidData, saveData, emphasizeTarget, saveComment, getValidDataWithinRange} from '../../../../scenes/Asap/sagas/actions'

const SheetContainer = styled.div`
            position: relative;
            width: calc(${props => props.width}px);
            background: #fff;
        `

class Sheet extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: defaultDummyData,
        }
    }

    render(){
        const {width, height} = this.props
        return (
            <FullPage>
                <SheetContainer width={width}>
                    <BarSheet width={width} height={height}/>
                </SheetContainer>
            </FullPage>
        )
    }
}
export default Sheet
