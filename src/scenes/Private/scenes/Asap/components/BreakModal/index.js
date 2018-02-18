import React from 'react'
import {Modal, Button, Input, Header} from 'semantic-ui-react'
import styled from 'styled-components'

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

class BreakModal extends React.Component {
    constructor(props) {
        super(props)
        this.initialState = {
            selectedData: null,
            range : null,
            comments: []
        }
        this.state = this.initialState
        this.initState = this.initState.bind(this)
        this.close = this.close.bind(this)
        this.save = this.save.bind(this)
        this.isValidItem = this.isValidItem.bind(this)
        this.checkValidation = this.checkValidation.bind(this)
        this.editLabel = this.editLabel.bind(this)
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
        if(selectedData===undefined || selectedData===null)
            return false
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

    componentWillReceiveProps(nextProps){
        const {data, range, comments} = nextProps
        this.initState(data, range, comments)
    }

    componentDidMount(){
        const {data, range, comments} = this.props
        this.initState(data, range, comments)
    }

    initState(data, range, comments){
        if (this.checkValidation(data)) {
            this.setState({
                selectedData: data,
                range,
                comments: data.map((row, row_idx)=>{
                    return row.map((cell, col_idx)=>{
                        const filtered =comments.filter((comment)=>{
                            if(range[0]+col_idx == comment.col
                                && range[2]+row_idx ==comment.row){
                                return true;
                            }
                            return false
                        })
                        if(filtered.length!=0){
                            return filtered[0].value
                        }else{
                            return data[row_idx][col_idx]
                        }
                    })
                })
            })
        }
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
        this.setState(this.initialState)
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
        return (
            <Modal size='mini' dimmer={'inverted'} open={this.props.opened && this.checkValidation(this.props.data)} onClose={this.close}>
                <Modal.Header>
                    중단점 편집
                </Modal.Header>
                <Modal.Content scrolling>
                    <Header as="h5">해당 값 대신에 보여질 텍스트를 입력하세요</Header>
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
                </Modal.Content>
                <Modal.Actions>
                    <Button compact onClick={this.close}>
                        취소
                    </Button>
                    <Button compact onClick={() => {
                        this.save()
                        this.close()
                    }} positive icon='checkmark' labelPosition='right' content='확인'/>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default BreakModal