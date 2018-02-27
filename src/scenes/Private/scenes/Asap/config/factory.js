import {TEMPLATE} from './types'
import LabelModal from '../components/LabelModal'
import BreakModal from '../components/BreakModal'
import {getRangeOfValidData, getValidDataWithinRange, performDataValidation} from "../sagas/actions";
//TODO: context switching and validation

const checkValidation = (selectedData) => {
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


const factory = {
    sheet: (data, comments=[], emphasisTarget=[-1,-1,-1,-1]) => {
        return {
            ['ONLY_SHEET']: () => { // wild card
                return {
                    cells: function (row, col, prop) {
                        let cellProperties = {}
                        const range = getRangeOfValidData(data)
                        let emphasized = emphasisTarget || [range[1],range[1],range[3],range[3]]
                        if (range[0] > emphasized[0] || emphasized[1] > range[1]
                            || range[2] > emphasized[2] || emphasized[3] > range[3]) {
                            emphasized = [range[1],range[1],range[3],range[3]]
                        }

                        const inComments = (col, row) => {
                            return comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (col === emphasized[0] && row === emphasized[2]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.classList.add('emphasisCell')
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {

                            if (range[0] <= col && col <= range[1]
                                && range[2] <= row && row <= range[3]) {
                                cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                    td.innerText = value
                                    td.style.color = '#000'
                                    if (inComments(col, row)) {
                                        td.classList.add('commentCell')
                                    }
                                }
                            } else {
                                cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                    td.style.background = '#f1f1f5'
                                    td.innerText = value
                                    if (inComments(col, row)) {
                                        td.classList.add('commentCell')
                                    }
                                }
                            }
                        }
                        return cellProperties
                    }
                }
            },
            [TEMPLATE.BAR_EMPHASIS]: (ctx) => {
                return {
                    contextMenu: {
                        callback: function (key, options) {
                            if (key === 'emphasize') {
                                this.props.emphasizeTarget(options.end.col, options.end.row)
                            }
                            if (key === 'label') {
                                const selectedData = data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                const range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                if(checkValidation(selectedData)){
                                    this.props.modalOpen(true, {selectedData, range})
                                }
                            }
                        }.bind(ctx),
                        items: {
                            "hsep4": "---------",
                            "label": {
                                name: '라벨 편집'
                            },
                            "emphasize": {
                                name: '강조하기'
                            },

                        }
                    },
                    cells: function (row, col, prop) {
                        let cellProperties = {}


                        const range = getRangeOfValidData(data)
                        let emphasized = this.props.emphasisTarget || [range[1],range[1],range[3],range[3]]
                        if (range[0] > emphasized[0] || emphasized[1] > range[1]
                            || range[2] > emphasized[2] || emphasized[3] > range[3]) {
                            emphasized = [range[1],range[1],range[3],range[3]]
                        }

                        const inComments = (col, row) => {
                            return this.props.comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (col === emphasized[0] && row === emphasized[2]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.classList.add('emphasisCell')
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {

                            if (range[0] <= col && col <= range[1]
                                && range[2] <= row && row <= range[3]) {
                                cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                    td.innerText = value
                                    if (inComments(col, row)) {
                                        td.classList.add('commentCell')
                                    }
                                }
                            } else {
                                cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                    td.style.background = '#f1f1f5'
                                    td.innerText = value
                                    if (inComments(col, row)) {
                                        td.classList.add('commentCell')
                                    }
                                }
                            }
                        }
                        return cellProperties
                    }.bind(ctx)
                }
            },
            [TEMPLATE.BAR]: (ctx) => {
                return {
                    contextMenu: {
                        callback: function (key, options) {
                            if (key === 'label') {
                                const selectedData = data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                const range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                if(checkValidation(selectedData)){
                                    this.props.modalOpen(true, {selectedData, range})
                                }
                            }
                        }.bind(ctx),
                        items: {
                            "hsep4": "---------",
                            "label": {
                                name: '라벨 편집'
                            },
                        }
                    },
                    cells: function (row, col, prop) {
                        let cellProperties = {}


                        const range = getRangeOfValidData(data)

                        const inComments = (col, row) => {
                            return this.props.comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (range[0] <= col && col <= range[1]
                            && range[2] <= row && row <= range[3]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.style.background = '#f1f1f5'
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        }
                        return cellProperties
                    }.bind(ctx)
                }
            },
            [TEMPLATE.BAR_HORIZONTAL]: (ctx) => {
                return {
                    contextMenu: {
                        callback: function (key, options) {
                            if (key === 'label') {
                                const selectedData = data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                const range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                if(checkValidation(selectedData)){
                                    this.props.modalOpen(true, {selectedData, range})
                                }
                            }
                        }.bind(ctx),
                        items: {
                            "hsep4": "---------",
                            "label": {
                                name: '라벨 편집'
                            },
                        }
                    },
                    cells: function (row, col, prop) {
                        let cellProperties = {}


                        const range = getRangeOfValidData(data)

                        const inComments = (col, row) => {
                            return this.props.comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (range[0] <= col && col <= range[1]
                            && range[2] <= row && row <= range[3]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.style.background = '#f1f1f5'
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        }
                        return cellProperties
                    }.bind(ctx)
                }
            },
            [TEMPLATE.BAR_HORIZONTAL_EMPHASIS]: (ctx) => {
                return {
                    contextMenu: {
                        callback: function (key, options) {
                            if (key === 'emphasize') {
                                this.props.emphasizeTarget(options.end.col, options.end.row)
                            }
                            if (key === 'label') {
                                const selectedData = data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                const range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                if(checkValidation(selectedData)){
                                    this.props.modalOpen(true, {selectedData, range})
                                }
                            }
                        }.bind(ctx),
                        items: {
                            "hsep4": "---------",
                            "label": {
                                name: '라벨 편집'
                            },
                            "emphasize": {
                                name: '강조하기'
                            },

                        }
                    },
                    cells: function (row, col, prop) {
                        let cellProperties = {}


                        const range = getRangeOfValidData(data)
                        let emphasized = this.props.emphasisTarget || [range[1],range[1],range[3],range[3]]
                        if (range[0] > emphasized[0] || emphasized[1] > range[1]
                            || range[2] > emphasized[2] || emphasized[3] > range[3]) {
                            emphasized = [range[1],range[1],range[3],range[3]]
                        }

                        const inComments = (col, row) => {
                            return this.props.comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (col === emphasized[0] && row === emphasized[2]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.classList.add('emphasisCell')
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {

                            if (range[0] <= col && col <= range[1]
                                && range[2] <= row && row <= range[3]) {
                                cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                    td.innerText = value
                                    if (inComments(col, row)) {
                                        td.classList.add('commentCell')
                                    }
                                }
                            } else {
                                cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                    td.style.background = '#f1f1f5'
                                    td.innerText = value
                                    if (inComments(col, row)) {
                                        td.classList.add('commentCell')
                                    }
                                }
                            }
                        }
                        return cellProperties
                    }.bind(ctx)
                }
            },
            [TEMPLATE.BAR_GROUPED]: (ctx) => {
                return {
                    contextMenu: {
                        callback: function (key, options) {
                            if (key === 'label') {
                                const selectedData = data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                const range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                if(checkValidation(selectedData)){
                                    this.props.modalOpen(true, {selectedData, range})
                                }
                            }
                        }.bind(ctx),
                        items: {
                            "hsep4": "---------",
                            "label": {
                                name: '라벨 편집'
                            },
                        }
                    },
                    cells: function (row, col, prop) {
                        let cellProperties = {}


                        const range = getRangeOfValidData(data)

                        const inComments = (col, row) => {
                            return this.props.comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (range[0] <= col && col <= range[1]
                            && range[2] <= row && row <= range[3]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.style.background = '#f1f1f5'
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        }
                        return cellProperties
                    }.bind(ctx)
                }
            },
            [TEMPLATE.LINE_DENSE]: (ctx) => {
                return {
                    contextMenu: {
                        callback: function (key, options) {
                            if (key === 'label') {
                                const selectedData = data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                const range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                if(checkValidation(selectedData)){
                                    this.props.modalOpen(true, {selectedData, range})
                                }
                            }
                        }.bind(ctx),
                        items: {
                            "hsep4": "---------",
                            "label": {
                                name: '말풍선 지정'
                            },
                        }
                    },
                    cells: function (row, col, prop) {
                        let cellProperties = {}


                        const range = getRangeOfValidData(data)

                        const inComments = (col, row) => {
                            return this.props.comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (range[0] <= col && col <= range[1]
                            && range[2] <= row && row <= range[3]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.style.background = '#f1f1f5'
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        }
                        return cellProperties
                    }.bind(ctx)
                }
            },
            [TEMPLATE.LINE]: (ctx) => {
                return {
                    contextMenu: {
                        callback: function (key, options) {
                            if (key === 'label') {
                                const selectedData = data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                const range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                if(checkValidation(selectedData)){
                                    this.props.modalOpen(true, {selectedData, range})
                                }
                            }
                        }.bind(ctx),
                        items: {
                            "hsep4": "---------",
                            "label": {
                                name: '말풍선 지정'
                            },
                        }
                    },
                    cells: function (row, col, prop) {
                        let cellProperties = {}


                        const range = getRangeOfValidData(data)

                        const inComments = (col, row) => {
                            return this.props.comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                        }

                        if (range[0] <= col && col <= range[1]
                            && range[2] <= row && row <= range[3]) {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        } else {
                            cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                td.style.background = '#f1f1f5'
                                td.innerText = value
                                if (inComments(col, row)) {
                                    td.classList.add('commentCell')
                                }
                            }
                        }
                        return cellProperties
                    }.bind(ctx)
                }
            },
        }
    },
    modal:{
        [TEMPLATE.BAR]: LabelModal,
        [TEMPLATE.BAR_EMPHASIS]: LabelModal,
        [TEMPLATE.BAR_HORIZONTAL]: LabelModal,
        [TEMPLATE.BAR_HORIZONTAL_EMPHASIS]: LabelModal,
        [TEMPLATE.BAR_GROUPED]: LabelModal,
        [TEMPLATE.LINE]: BreakModal,
        [TEMPLATE.LINE_DENSE]: BreakModal,
    },
    mask:(data, comments=[], emphasisTarget=[-1,-1,-1,-1])=> {
        return {
            [TEMPLATE.BAR_EMPHASIS]: () => {
                let ret = {
                    mask: [],
                    comments: [], // [commentList, commentList, ...] : commentList is Array
                    breakPoint: -1
                }
                const range = getRangeOfValidData(data)

                //TODO validation of props and error handling
                let emphasisRange = emphasisTarget
                if (emphasisRange === null) {
                    emphasisRange = [range[1], range[1], range[3], range[3]]
                }
                const validation = performDataValidation(data, range, comments, emphasisRange)
                // ret.comments = validation.comments
                const emphasisRowPos = validation.breakPoint[2]

                if(emphasisRowPos!=-1){
                    // # emphasis scene
                    ret.mask.push(
                        validation.rawData.filter((row, row_idx) => {
                            if (row_idx == emphasisRowPos) {
                                return false
                            }
                            return true
                        })
                    )
                    ret.comments.push(
                        validation.comments.filter((comment) => {
                            if (comment.row == emphasisRowPos) {
                                return false
                            }
                            return true
                        })
                    )
                }


                // # else
                ret.mask.push(validation.rawData)
                ret.comments.push(validation.comments)

                ret.breakPoint = validation.breakPoint[2]
                return ret
            },

            [TEMPLATE.BAR_HORIZONTAL_EMPHASIS]: () => {
                let ret = {
                    mask: [],
                    comments: [], // [commentList, commentList, ...] : commentList is Array
                    breakPoint: -1
                }
                const range = getRangeOfValidData(data)

                //TODO validation of props and error handling
                let emphasisRange = emphasisTarget
                if (emphasisRange === null) {
                    emphasisRange = [range[1], range[1], range[3], range[3]]
                }
                const validation = performDataValidation(data, range, comments, emphasisRange)
                // ret.comments = validation.comments
                const emphasisRowPos = validation.breakPoint[2]

                if(emphasisRowPos!=-1){
                    // # emphasis scene
                    ret.mask.push(
                        validation.rawData.filter((row, row_idx) => {
                            if (row_idx == emphasisRowPos) {
                                return false
                            }
                            return true
                        })
                    )
                    ret.comments.push(
                        validation.comments.filter((comment) => {
                            if (comment.row == emphasisRowPos) {
                                return false
                            }
                            return true
                        })
                    )
                }


                // # else
                ret.mask.push(validation.rawData)
                ret.comments.push(validation.comments)
                ret.breakPoint = validation.breakPoint[2]
                return ret
            },

            [TEMPLATE.BAR]: () => {
                let ret = {
                    mask:[],
                    comments: [], // [commentList, commentList, ...] : commentList is Array
                }
                const range = getRangeOfValidData(data)
                //TODO validation of props and error handling
                const validation = performDataValidation(data, range, comments)
                ret.mask.push(validation.rawData)
                ret.comments.push(validation.comments)

                return ret
            },

            [TEMPLATE.BAR_HORIZONTAL]: () => {
                let ret = {
                    mask:[],
                    comments: [], // [commentList, commentList, ...] : commentList is Array
                }
                const range = getRangeOfValidData(data)
                //TODO validation of props and error handling
                const validation = performDataValidation(data, range, comments)
                ret.mask.push(validation.rawData)
                ret.comments.push(validation.comments)
                return ret
            },

            [TEMPLATE.BAR_GROUPED]: () => {
                let ret = {
                    mask:[],
                    comments: [], // [commentList, commentList, ...] : commentList is Array
                }
                const range = getRangeOfValidData(data)
                //TODO validation of props and error handling
                const validation = performDataValidation(data, range, comments)
                ret.mask.push(validation.rawData)
                ret.comments.push(validation.comments)
                return ret
            },

            [TEMPLATE.LINE]: () => {
                let ret = {
                    mask:[],
                    comments: [], // [commentList, commentList, ...] : commentList is Array
                }
                const range = getRangeOfValidData(data)
                //TODO validation of props and error handling
                const validation = performDataValidation(data, range, comments)
                const commentsToSend = validation.comments
                commentsToSend.sort((a, b) => a.row - b.row)
                commentsToSend.forEach((comment) => {
                    ret.mask.push(validation.rawData.slice(0, comment.row + 1))
                    ret.comments.push(commentsToSend)
                })
                ret.mask.push(validation.rawData)
                ret.comments.push(commentsToSend)
                return ret
            },

            [TEMPLATE.LINE_DENSE]: () => {
                let ret = {
                    mask:[],
                    comments: [], // [commentList, commentList, ...] : commentList is Array
                }
                const range = getRangeOfValidData(data)
                //TODO validation of props and error handling
                const validation = performDataValidation(data, range, comments)
                const commentsToSend = validation.comments
                commentsToSend.sort((a, b) => a.row - b.row)
                commentsToSend.forEach((comment) => {
                    ret.mask.push(validation.rawData.slice(0, comment.row + 1))
                    ret.comments.push(commentsToSend)
                })
                ret.mask.push(validation.rawData)
                ret.comments.push(commentsToSend)
                return ret
            }
        }
    }
}
export default factory