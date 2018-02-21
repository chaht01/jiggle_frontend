import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { CustomPicker, CirclePicker } from 'react-color'
import Dropzone from 'react-dropzone'
import StackGrid from 'react-stack-grid'

const Panel = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    left: auto;
    right: 0;
    top: 0;
    width: 360px;
    height: 100%;
    background: #2b2d2f;
    padding: 30px 0 0 0;
    -webkit-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    -moz-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    z-index: 1000;
`
Panel.Section = styled.div`
    padding: 0 0 0 2rem;
`

const ImageUploader = styled.div`
    height: 300px;
    border-bottom: 1px solid #333738 !important;
`

const ScrollStackGrid = styled(StackGrid)`
    height: 300px !important;
    overflow: auto;
`

const Palette = Panel.Section.extend`
    display:flex;
    flex-direction: column;
    height: ${props => props.height}px;
    padding-top: 30px;
    border-bottom: 1px solid #333738;
`
Palette.Title = styled.div`
    font-size: 0.8rem;
    color: #848484;
    margin-bottom: 15px;
    flex-shirink: none;
`
Palette.Colors = styled.div`
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
`
const Color = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
    flex-shrink: none;
    margin: 0 10px 10px 0;
    border-radius: 10px;
    background: #DFE0E1;
    &:after{
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        background: ${props => props.color};
        left: 50%;
        top:50%;
        transform: translate(-50%, -50%);
    }
`

class ColorPickerRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            files: [],
            previews:[]
        }
        this.grid = null
        this.onDrop = this.onDrop.bind(this)
        this.preventWheel = this.preventWheel.bind(this)
        this.handleWheelEvent = this.handleWheelEvent.bind(this)
    }
    handleWheelEvent(element, e){
        const dY = e.deltaY,
            currScrollPos = element.scrollTop,
            scrollableDist = element.scrollHeight - element.clientHeight
        if((dY>0 && currScrollPos >= scrollableDist) ||
            (dY<0 && currScrollPos <= 0)){
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        e.stopPropagation();
    }
    preventWheel(node){
        ReactDOM.findDOMNode(node).addEventListener('wheel', this.handleWheelEvent.bind(this, ReactDOM.findDOMNode(node)), {passive: false})
    }
    onDrop(files){
        this.setState({
            files: files
        })
        console.log(files)
        /*
        const reader  = new FileReader()
        reader.addEventListener('load', () => {
            const img = new Image()
            img.width = 50
            img.height = 100
            img.src = reader.result
            this.setState((prevState)=>{
                return {
                    ...prevState,
                    previews: prevState.previews.slice().push(img)
                }
            })
            console.log(this.state)
        })
        reader.readAsDataURL(files[0])
        */
    }
    componentDidMount(){
        this.preventWheel(this.grid)
    }
    componentDidUpdate(){
        this.preventWheel(this.grid)
    }
    render(){
        return (
            <div>
                <Palette height="135">
                    <Palette.Title>배경테마</Palette.Title>
                    <Palette.Colors>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                        <Color color="#428bca"/>
                    </Palette.Colors>
                </Palette>
                <Palette height="190">
                    <Palette.Title>그래프 컬러</Palette.Title>
                </Palette>
                <ScrollStackGrid ref={node => this.grid = node} columnWidth={100} monitorImagesLoaded={true} gutterWidth={10}>
                    {this.state.files.length>0 && this.state.files.map((file, i)=>(
                        <div key={i}><img style={{width:'100%'}} src={file.preview}/></div>

                    ))}
                </ScrollStackGrid>

                <CirclePicker/>
                <Dropzone onDrop={this.onDrop}/>
            </div>
        )
    }
}

const ColorPicker = CustomPicker(ColorPickerRepresentation)
const AppearanceController = () => {
    return(
        <Panel>
            <ColorPicker></ColorPicker>
        </Panel>
    )
}

export default AppearanceController