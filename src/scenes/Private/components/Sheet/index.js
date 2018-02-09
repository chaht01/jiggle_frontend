import React from 'react'

/* COMPONENTS */
import Handson from '../../../../components/Handson'
import FullPage from '../../../../components/Layout/FullPage'

import styled from 'styled-components'
import Handsontable from 'handsontable'

import connect from 'react-redux/es/connect/connect'

import {getRangeOfValidData} from '../../scenes/Asap/sagas/actions'


const SheetContainer = styled.div`
            position: relative;
            width: calc(${props => props.width}px);
            background: #fff;
        `
const SheetFakeCover = styled.div`
            position: absolute;
            display: flex;
            justify-content:center;
            align-items: center;
            background: rgba(0,0,0,0.7);
            border-radius: 2px;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index:1000;
            &:after{
            position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                content: "클릭하여 수정하기";
                font-size: 1.5rem;
                color: #fff;
            }
           
        `


const mapStateToDispatch = (state, ownProps) => {
    return {
        focusTarget: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.focusTarget,
    }
}

class SheetRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.dirtyData = [['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],
            ['','','','','','','','','','','','','','','','','','','',''],]
        this.setPlaceHolderStatus = this.setPlaceHolderStatus.bind(this)
        this.checkDirty = this.checkDirty.bind(this)
        this.saveData = this.saveData.bind(this)
        this.handson = null
    }

    setPlaceHolderStatus(isOver){
        this.setState({placeholder:isOver})
    }

    checkDirty(){
        for(let i=0; i<this.dirtyData.length; i++){
            for(let j=0; j<this.dirtyData[i].length; j++){
                if(['', undefined, null].indexOf(this.dirtyData[i][j])==-1)
                    return true;
            }
        }
        return false;
    }

    saveData(){
        const dataToSave = JSON.parse(JSON.stringify(this.dirtyData))
        this.props.saveData(dataToSave)
    }
    render(){
        const {width, height} = this.props

        return (
            <FullPage>
                <SheetContainer width={width}>
                    <Handson
                        ref={(handson)=> this.handson = handson}
                        settings={{
                            data: this.dirtyData,
                            onAfterChange:(changes, source) => {
                                if(source !== 'loadData'){
                                    this.saveData()
                                }
                            },
                            onAfterUndo: this.saveData,
                            onAfterCreateRow:this.saveData,
                            onAfterCreateCol:this.saveData,
                            onAfterRemoveCol:this.saveData,
                            onAfterRemoveRow:this.saveData,
                            colHeaders:true,
                            rowHeaders:true,
                            width:width,
                            height:height,
                            colWidths:80,
                            rowHeights:23,
                            cells: (row, col, prop) => {
                                let cellProperties = {}
                                const range = getRangeOfValidData(this.dirtyData)
                                if(this.props.focusTarget === null){
                                    if(col === range[1] && row === range[3]){
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            td.style.border = '2px solid #FA4D1E'
                                            td.innerText = value
                                        }
                                    }else{
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            td.innerText = value
                                        }
                                    }
                                }else{
                                    if(col === this.props.focusTarget[0] && row === this.props.focusTarget[1]){
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            td.style.border = '2px solid #FA4D1E'
                                            td.innerText = value
                                        }
                                    }else{
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            td.innerText = value
                                        }
                                    }
                                }
                                return cellProperties
                            }
                        }}

                    />
                </SheetContainer>
            </FullPage>
        )
    }

}

const Sheet = connect(
    mapStateToDispatch,
    null
)(SheetRepresentation)

export default Sheet
