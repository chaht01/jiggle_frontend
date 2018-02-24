import React from 'react'
import {Modal, Button, Input, Header} from 'semantic-ui-react'
import styled from 'styled-components'
import connect from "react-redux/es/connect/connect";
import {saveComment} from "../../sagas/actions";
import profile from '../../../../../../assets/images/modal/e-39.png'

const LabelEditor = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 1rem;
    align-content: start;
    grid-row-gap: 1rem;
    overflow: auto;
`
LabelEditor.Value = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

const StyledModal = styled(Modal)`
    width: 523px !important;
    padding: 36px 2rem 29px;
    text-align: center;
    margin-left: 0 !important;
    transform: translateX(-50%);
`
StyledModal.Close = styled.a`
    position: absolute;
    cursor: pointer;
    display: block;
    width: ${15*Math.sqrt(2)}px;
    height: ${15*Math.sqrt(2)}px;
    transform: rotate(45deg);
    right: 0;
    top: 0;
    margin-top: 30px;
    margin-right: 31px;
    &:before, &:after{
        display:block;
        position:absolute;
        content:'';
        width: 100%;
        height: 2px;
        left: 50%;
        top: 50%;
        background: #A5ABB8;
        transition: all .2s;
        transform: translate(-50%, -50%);
    }
    &:before{
        transform: translate(-50%, -50%) rotate(90deg);
    }
    &:hover{
        &:before,&:after{
            background: #878d9a;
        }
    }
    
`
StyledModal.Profile = styled.img`
    position: relative;
    display: block;
    width: 122px;
    height: 122px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 28px;
    text-align: center;
`
StyledModal.Header = styled.div`
    margin-bottom: 15px;
    font-weight: 700;
    font-size: 27px;
    color: #2b2b2b;
    text-align: center;
`
StyledModal.Description = styled.div`
    margin-bottom: 15px;
    font-weight: 400;
    font-size: 18px;
    color: #494949;
    text-align: center;
`
StyledModal.Content = styled(Modal.Content)`
    padding: 16px 0 31px;
`
StyledModal.Actions = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
`

const mapStateToProps = (state, ownProps) => {
    return {
        comments: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveComment: (comments) => dispatch(saveComment(comments)),
    }
}
class LabelModalRepresentation extends React.Component {
    constructor(props) {
        super(props)
        this.initialState = {
            selectedData: null,
            range : null,
            comments: []
        }
        this.state = this.initialState
        this.close = this.close.bind(this)
        this.save = this.save.bind(this)
        this.isValidItem = this.isValidItem.bind(this)
        this.checkValidation = this.checkValidation.bind(this)
        this.editLabel = this.editLabel.bind(this)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.payload === null || !this.checkValidation(nextProps.payload.selectedData)){
            //close
            this.props.close()
        }else{
            const {selectedData, range} = nextProps.payload
            this.setState({
                selectedData,
                range,
                comments: selectedData.map((row, row_idx)=>{
                    return row.map((cell, col_idx)=>{
                        const filtered =this.props.comments.filter((comment)=>{
                            if(range[0]+col_idx == comment.col
                                && range[2]+row_idx ==comment.row){
                                return true;
                            }
                            return false
                        })
                        if(filtered.length!=0){
                            return filtered[0].value
                        }else{
                            return selectedData[row_idx][col_idx]
                        }
                    })
                })
            })
        }
    }

    isValidItem(item) {
        if (typeof item == 'string') {
            item = item.trim()
        }
        if (['', undefined, null].indexOf(item) > -1) {
            return false
        }
        return true
    }

    checkValidation(selectedData) {
        let totalCnt = 0
        let emptyCnt = 0
        selectedData.map((row) => {
            row.map((cell) => {
                totalCnt++
                if (typeof cell == 'string') {
                    cell = cell.trim()
                }
                if (['', undefined, null].indexOf(cell) > -1) {
                    emptyCnt++;
                }
            })
        })
        if (totalCnt == emptyCnt) {
            return false
        }
        return true
    }

    editLabel(e, rowIdx, colIdx){
        e.persist()
        this.setState((prevState)=>{
            return {
                ...prevState,
                comments: prevState.comments.map((row, r)=>{
                    return row.map((cell, c)=>{
                        if(r == rowIdx && c == colIdx){
                            return e.target.value
                        }else{
                            return cell
                        }
                    })
                })
            }
        })
    }

    close() {
        this.props.close()
    }

    save() {
        let ret = []

        this.state.comments.map((c_row, c_row_idx)=>{
            return c_row.map((c_cell, c_col_idx) => {
                if(!this.isValidItem(c_cell) || c_cell === this.state.selectedData[c_row_idx][c_col_idx]){
                    ret.push({
                        col: c_col_idx + this.state.range[0], // inc offset of range col start
                        row: c_row_idx + this.state.range[2], // inc offset of range row start
                        value: '' // this means delete this comment from list
                    })
                }else{
                    ret.push({
                        col: c_col_idx + this.state.range[0], // inc offset of range col start
                        row: c_row_idx + this.state.range[2], // inc offset of range row start
                        value: c_cell
                    })
                    return c_cell
                }
            })
        })
        this.props.saveComment(ret)
    }

    render() {
        console.log('Label!')
        return (
            <StyledModal open={this.props.open} onClose={this.close}>
                <StyledModal.Close onClick={this.close}/>
                <StyledModal.Profile src={profile}/>
                <StyledModal.Header>
                    라벨 편집
                </StyledModal.Header>
                <StyledModal.Description>
                    해당 값에서 라벨이 표시됩니다. 표시될 문구를 적어주세요.
                </StyledModal.Description>
                <StyledModal.Content>
                    {
                        this.state.selectedData !== null ?
                            <LabelEditor>
                                {this.state.comments.map((row, r) => {
                                    return row.map((item, c) => {
                                        return (
                                            <Input key={`label_${r}_${c}`} fluid
                                                   value={item}
                                                   onChange={(e)=> this.editLabel(e, r, c)}
                                                   disabled={!this.isValidItem(this.state.selectedData[r][c])}
                                                   placeholder={!this.isValidItem(this.state.selectedData[r][c]) ? '입력된 값이 없어 라벨을 입력할 수 없습니다' : this.state.selectedData[r][c]}/>
                                        )
                                    })
                                })}
                            </LabelEditor>
                            : null
                    }
                </StyledModal.Content>
                <StyledModal.Actions>
                    <Button compact onClick={() => {
                        this.save()
                        this.close()
                    }} positive icon='checkmark' labelPosition='right' content='확인'/>
                </StyledModal.Actions>
            </StyledModal>
        )
    }
}

const LabelModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelModalRepresentation)

export default LabelModal