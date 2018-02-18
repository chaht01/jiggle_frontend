import {getRangeOfValidData, emphasizeTarget} from "../../sagas/actions";
const config = {
    bar_emphasis:{
        contextMenu:{
            callback: (data, labelModal) =>{
                return (key, options)=>{
                    if(key === 'emphasize'){
                        emphasizeTarget(options.end.col, options.end.row)
                    }
                    if(key === 'label'){
                        const selectedData = data.slice(options.start.row, options.end.row+1).map((row)=>row.slice(options.start.col, options.end.col+1))
                        labelModal.open(selectedData, [options.start.col, options.end.col, options.start.row, options.end.row])
                    }
                }
            },
            items:{
                "hsep4": "---------",
                "emphasize": {
                    name: '강조하기'
                },
                "label": {
                    name: '라벨 편집'
                },
            }
        },
        cells: (data, emphasisTarget, comments) => {
            return (row, col, prop) => {
                let cellProperties = {}


                const range = getRangeOfValidData(data)
                let emphasized = emphasisTarget || [range[1], range[3]]
                if(range[0]>emphasized[0] || emphasized[0]>range[1]
                    || range[2]>emphasized[1] || emphasized[1]>range[3]){
                    emphasized = [range[1], range[3]]
                }

                if(col === emphasized[0] && row === emphasized[1]){
                    cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                        td.style.background = '#FA4D1E'
                        td.style.color = "#fff"
                        td.innerText = value
                    }
                }else{
                    if(range[0]<=col && col<=range[1]
                        && range[2]<=row && row<=range[3]){
                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                            td.innerText = value
                        }
                    }else{
                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                            td.style.background = '#f1f1f5'
                            td.innerText = value
                        }
                    }
                }

                comments.map((comment)=>{
                    if(col == comment.col && row == comment.row){
                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                            td.classList.add('commentCell')
                            td.innerText = value
                        }
                    }
                })
                return cellProperties
            }
        }
    },
    bar:{

    }
}
export default config