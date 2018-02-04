import React from 'react'

/* COMPONENTS */
import Handson from '../../../../components/Handson'
import FullPage from '../../../../components/Layout/FullPage'

import styled from 'styled-components'

import connect from 'react-redux/es/connect/connect'




class Sheet extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            placeholder: false,
            dirtyData: this.props.dirtyData
        }
        this.setPlaceHolderStatus = this.setPlaceHolderStatus.bind(this)
        this.checkDirty = this.checkDirty.bind(this)
        this.handson = null
    }

    setPlaceHolderStatus(isOver){
        this.setState({placeholder:isOver})
    }

    checkDirty(){
        for(let i=0; i<this.state.dirtyData.length; i++){
            for(let j=0; j<this.state.dirtyData[i].length; j++){
                if(['', undefined, null].indexOf(this.state.dirtyData[i][j])==-1)
                    return true;
            }
        }
        return false;
    }
    shouldComponentUpdate(nextProps, nextState){
        if(nextState.placeholder != this.state.placeholder){
            return true;
        }
        if(this.state.dirtyData.length == nextProps.dirtyData.length){
            return false;
        }
        return true;
    }
    render(){
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
        const saveData = () => {
            const dataToSave = JSON.parse(JSON.stringify(this.state.dirtyData))
            this.props.saveData(dataToSave)
        }
        return (
            <FullPage>
                <SheetContainer width={this.props.width}>
                    <Handson
                        ref={(handson)=> this.handson = handson}
                        data={this.state.placeholder ? this.props.placeholderData : this.state.dirtyData}
                        afterDeselect={()=>{
                            if(!this.checkDirty()){
                                this.setPlaceHolderStatus(false)
                            }
                        }}

                        afterChange={(changes, source) => {
                            if(source !== 'loadData'){
                                saveData()
                            }
                        }}
                        afterUndo={()=>saveData()}
                        afterCreateRow={()=>saveData()}
                        afterCreateCol={()=>saveData()}
                        afterRemoveCol={()=>saveData()}
                        afterRemoveRow={()=>saveData()}

                        colHeaders={true}
                        rowHeaders={true}
                        width={this.props.width}
                        height={this.props.height}
                        colWidths="80"
                        rowHeights="23"

                    />
                    {this.state.placeholder && (
                        <SheetFakeCover onClick={()=>{
                            this.setPlaceHolderStatus(false)
                            setTimeout(()=>this.handson.getInstance().selectCell(0, 0, 0, 0, true), 0)
                        }}/>)}

                </SheetContainer>
            </FullPage>
        )
    }

}

export default Sheet
