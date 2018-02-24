import React from 'react'
import ReactDOM from 'react-dom'
/* COMPONENT */
import {Modal, Header, Loader} from 'semantic-ui-react'
import Sheet from '../Sheet'
import Handson from '../../../../../../components/Handson'
import FullPage from '../../../../../../components/Layout/FullPage'
import Button from '../../../../../../components/Button'
import PaddedContainer from '../PaddedContainer'
import SectionFooter from '../SectionFooter'

import styled from 'styled-components'
import connect from "react-redux/es/connect/connect";
import {saveMask} from "../../sagas/actions";
import factory from '../../config/factory'
import * as _ from "lodash";


const SheetOpts = styled.div`
    width: 830px;
    text-align: right;
    padding: 1rem 0;
`


const mapStateToProps = (state, ownProps) => {
    return {
        dirtyDataLoading: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.loading,
        placeholder: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.placeholder,
        safeMask: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.safeMask,

        data: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.data,
        comments:state.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments,
        emphasisTarget:state.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget,
        templateType: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveMask : (mask) => dispatch(saveMask(mask))
    }
}


class DataConfigViewRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.size = {
            width: 0,
            height: 0,
        }
        this.next = this.next.bind(this)
        this.play = this.play.bind(this)
    }
    componentDidMount(){
        this.size = {
            width: 830,
            height: 400
        }
    }
    next(){
        if(this.props.safeMask!==null){
            this.props.activateSection(2)
        }
    }
    play(recentProps){
        let isValid = true
        try {
            const props = (recentProps || this.props)
            const {
                data,
                comments: rawComment,
                emphasisTarget,
                templateType,
            } = props
            const chartMaterials = factory.mask(data, rawComment, emphasisTarget)[templateType]()
            const { mask } = chartMaterials
            for (let i = 0; i < mask.length; i++) {
                if (mask[i].length == 0) {
                    isValid = false
                    break;
                }
            }
            if (isValid) {
                this.props.saveMask(chartMaterials)
            }else{

            }
        }catch (err){
            console.error('Cannot render')
            console.error(err.stack)
        }
    }
    componentWillReceiveProps(nextProps){
        if(!_.isEqual(nextProps.templateType, this.props.templateType)){
            this.play(nextProps)
        }
    }

    render(){
        const {placeholder, dirtyDataLoading} = this.props
        return (
            <React.Fragment>
                <PaddedContainer>
                    <FullPage>
                        <Sheet width="830" height="400"/>
                        <SheetOpts>
                            <Button compact size='small' rounded inverted theme={{fg:'#FA4D1E', bg:'#FA4D1E'}}
                                    onClick={()=>this.play()}
                                    disabled={dirtyDataLoading}
                            >
                                {dirtyDataLoading ? <Loader active inline='centered'/> : '결과확인'}
                            </Button>
                        </SheetOpts>

                    </FullPage>
                </PaddedContainer>
                <SectionFooter>
                    <Modal trigger={<Button compact size='small' theme={{fg:'#fff', bg:'#2C2D2F'}} style={{width: '7.5rem'}}>데이터 입력방법</Button>}
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
                    <Button compact size='small' theme={{fg:'#fff', bg:'#FA4D1E'}} style={{width: '7.5rem'}} onClick={this.next} disabled={this.props.safeMask===null}>확인</Button>
                </SectionFooter>
            </React.Fragment>
        )
    }

}

const DataConfigView = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataConfigViewRepresentation)

export default DataConfigView
