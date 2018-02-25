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
import {saveMask, updatePlayers} from "../../sagas/actions";
import factory from '../../config/factory'
import Workspace from '../Workspace'
import * as _ from "lodash";
import {colorsByType, colorToPalette} from "../../config/common";
import {THEME} from "../../config/types";


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
        saveMask : (mask) => dispatch(saveMask(mask)),
        updatePlayers: () => dispatch(updatePlayers())
    }
}


class DataConfigViewRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modalOpen: false
        }
        this.size = {
            width: 0,
            height: 0,
        }
        this.next = this.next.bind(this)
        this.play = this.play.bind(this)
        this.handleModal = this.handleModal.bind(this)
    }
    componentDidMount(){
        this.size = {
            width: 830,
            height: 400
        }
    }
    handleModal(openStatus){
        this.setState({modalOpen: openStatus})
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
            const { mask:masks } = chartMaterials
            for (let i = 0; i < masks.length; i++) {
                for(let j=0; j<masks[i].length; j++){
                    if (masks[i][j].length == 0) {
                        isValid = false
                        break;
                    }
                }
                if(!isValid)
                    break
            }
            if (isValid) {
                this.props.saveMask(chartMaterials)
                this.props.updatePlayers()
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
        const {placeholder, dirtyDataLoading, templateType} = this.props
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
                    <Modal trigger={<Button compact size='small' theme={{fg:'#fff', bg:'#2C2D2F'}} style={{width: '7.5rem'}} onClick={()=>this.handleModal(true)}>데이터 입력방법</Button>}
                           basic size='large'
                           closeOnEscape={true}
                           closeOnRootNodeClick={true}
                           open={this.state.modalOpen}
                    >
                        <Header icon='table' content='예시 데이터' />
                        <Modal.Content>
                            <DummyModalContent
                                placeholder={placeholder}
                                templateType={templateType}
                            />
                        </Modal.Content>
                        <Modal.Actions>
                            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} onClick={()=>this.handleModal(false)}>확인</Button>
                        </Modal.Actions>
                    </Modal>
                    <Button compact size='small' theme={{fg:'#fff', bg:'#FA4D1E'}} style={{width: '7.5rem'}} onClick={this.next} disabled={this.props.safeMask===null}>확인</Button>
                </SectionFooter>
            </React.Fragment>
        )
    }
}


const DummyContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
`
const DummyChart = styled.div`
    width: 533px;
`

class DummyModalContent extends React.Component{
    constructor(props){
        super(props)
        const {templateType} = this.props
        this.mask = factory.mask(this.props.placeholder.data, [], this.props.placeholder.emphasisTarget)[templateType]()
        this.sheetOpts = factory.sheet(this.props.placeholder.data, [], this.props.placeholder.emphasisTarget)['ONLY_SHEET']()
        const colors = colorsByType(templateType)
        const color = colors[Object.keys(colors)[0]][0]
        this.palette = colorToPalette(color, templateType, this.mask.mask)
        this.theme = THEME.DARK
    }
    render(){
        const {
            placeholder,
            templateType
        } = this.props
        return(
            <DummyContainer>
                <Handson settings={{
                    data: placeholder.data,
                    colHeaders:true,
                    rowHeaders:true,
                    width: 400,
                    height: 300,
                    readOnly: true,
                    contextMenu:false,
                    allowInsertRow: false,
                    allowInsertColumn: false,
                    autoInsertRow: false,
                    ...this.sheetOpts
                }}/>
                <DummyChart>
                    <Workspace
                        background="transparent"
                        errorVisible={true}
                        width={533}
                        safeMask={this.mask}
                        color={this.palette}
                        theme={this.theme}
                        templateType={templateType}
                        transitionActive={true}
                    />
                </DummyChart>


            </DummyContainer>
        )
    }
}


const DataConfigView = connect(
    mapStateToProps,
    mapDispatchToProps
)(DataConfigViewRepresentation)

export default DataConfigView
