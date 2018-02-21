import React from 'react'
import ReactDOM from 'react-dom'
/* COMPONENT */
import {Modal, Header} from 'semantic-ui-react'
import Sheet from '../Sheet'
import Handson from '../../../../../../components/Handson'
import FullPage from '../../../../../../components/Layout/FullPage'
import Button from '../../../../../../components/Button'
import PaddedContainer from '../PaddedContainer'

import Meta from '../Meta'
import numeral from 'numeral'
import styled from 'styled-components'
import connect from "react-redux/es/connect/connect";


const offsetTop = 0

const SheetOpts = styled.div`
    width: 830px;
    text-align: right;
    padding: 1rem 0;
`

const Footer = styled.div`
    position: relative;
    display:flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    bottom: 0;
    top: auto;
`
const mapStateToProps = (state, ownProps) => {
    return {
        placeholder: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.placeholder,
    }
}


class DataConfigViewRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.wall = null
        this.size = {
            width: 0,
            height: 0,
        }
    }
    componentDidMount(){
        this.size = {
            width: 830,
            height: 400
        }
    }
    render(){
        const {placeholder} = this.props
        return (
            <PaddedContainer>
                <FullPage>
                    <Sheet width="830" height="400"/>
                    <SheetOpts>
                        <Modal trigger={<Button compact size='small' rounded inverted theme={{fg:'#FA4D1E', bg:'#FA4D1E'}}>예시데이터 확인</Button>}
                               basic size='fullscreen'>
                            <Header icon='table' content='예시 데이터' />
                            <Modal.Content>
                                <Handson settings={{
                                    data:placeholder,
                                    colHeaders:true,
                                    rowHeaders:true,
                                    width: 400,
                                    height: 400,
                                    readOnly: true,
                                    contextMenu:false,
                                    allowInsertRow: false,
                                    allowInsertColumn: false,
                                    autoInsertRow: false,
                                    cells: (row, col, prop) => {
                                        let cellProperties = {}
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            const trimmed = value ? value.trim() : value
                                            if(['', undefined, null].indexOf(trimmed)==-1){
                                                td.innerText = value
                                                td.style.color = '#000'
                                            }else{
                                                td.style.background = '#f1f1f5'
                                            }
                                        }
                                        return cellProperties
                                    }
                                }}/>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}}>확인</Button>
                            </Modal.Actions>
                        </Modal>
                    </SheetOpts>

                </FullPage>
                <Footer>
                    <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}}>확인</Button>
                </Footer>
            </PaddedContainer>
        )
    }

}

const DataConfigView = connect(
    mapStateToProps,
    null
)(DataConfigViewRepresentation)

export default DataConfigView
