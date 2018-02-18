import React from 'react'
import ReactDOM from 'react-dom'
/* COMPONENT */
import Sheet from '../Sheet'
import FullPage from '../../../../../../components/Layout/FullPage'
import PaddedContainer from '../PaddedContainer'
import Meta from '../Meta'
import numeral from 'numeral'
import styled from 'styled-components'


const offsetTop = 0

class DataConfigView extends React.Component{
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
        return (
            <PaddedContainer>
                <Sheet width={this.size.width} height={this.size.height}/>
            </PaddedContainer>
        )
    }

}

export default DataConfigView
