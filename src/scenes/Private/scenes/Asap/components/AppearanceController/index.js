import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { CustomPicker, CirclePicker } from 'react-color'
import Dropzone from 'react-dropzone'
import StackGrid from 'react-stack-grid'
import Checkbox from '../../../../../../components/Checkbox'

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
    padding: 15px 0 0 0;
    -webkit-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    -moz-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    z-index: 1000;
`
Panel.Section = styled.div`
    padding: 30px 0 0 2rem;
`

Panel.Title = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #848484;
    margin-bottom: 20px;
    flex-shrink: none;
    padding-right: 2rem;
`

Panel.Content = styled.div`
    padding-right: 2rem;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    overflow: auto;
`

const Palette = Panel.Section.extend`
    display:flex;
    flex-direction: column;
    height: ${props => props.height}px;
    border-bottom: 1px solid #333738;
`
Palette.Title = Panel.Title
Palette.Colors = Panel.Content.extend`
    flex-direction: row;
`
const Color = styled.div`
    cursor: pointer;
    position: relative;
    width: 40px;
    height: 40px;
    flex-shrink: none;
    margin: 0 10px 10px 0;
    border-radius: 10px;
    background: #DFE0E1;
    box-shadow: 0px 2px 18px -1px rgba(0,0,0,0.6);
    &:after{
        position: absolute;
        width: 26px;
        height: 26px;
        border-radius: 30px;
        background: ${props => props.color};
        left: 50%;
        top:50%;
        content:"";
        transform: translate(-50%, -50%);
        transition: all .2s;
    }
    &:hover{
        &:after{
            transform: translate(-50%, -50%) scale(1.2);
        }
    }
`
const StyledCheckbox = styled(Checkbox)`
    color: #fff;
`

const ImageSection = Panel.Section.extend`
    display:flex;
    flex-direction: column;
    flex:1;
`

ImageSection.Content = Panel.Content.extend`
    flex:1;
`

const FileUploader = styled(Dropzone)`
    position: relative;
    cursor: pointer;
    height: 110px;
    width: 100%;
`
FileUploader.StandAlone = FileUploader.extend`
    width: 85px;
    height: 85px;
`
FileUploader.Zone = styled.div`
    position: relative;
    width: 70px;
    height: 70px;
    border-radius: 10px;
    border: 1px solid #161719;
    transition: all .2s;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    &:before, &:after{
        position: absolute;
        content:'';
        width: 40%;
        height: 2px;
        background: #161719;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: all .2s;
        ${props => props.active ? 'background:#FA4D1E;' : ''}
    }
    &:after{
        transform: translate(-50%, -50%) rotate(90deg);
    }
    &:hover{
        border-color:#FA4D1E;
        &:before, &:after{
            background: #FA4D1E;    
        }
    }
    ${props => props.active ? 'border-color:#FA4D1E;' : ''}
    
`
const ImageUploader = styled.div`
    height: 300px;
    border-bottom: 1px solid #333738 !important;
`

const ScrollStackGrid = styled(StackGrid)`
    height: 300px !important;
    overflow: auto;
`
const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    margin-bottom: 20px;
`
ImageGrid.Item = styled.div`
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 0;
    padding-top: 100%;
    border-radius: 10px;
    overflow:hidden;
    transition: all .2s;
    >img{
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    &:hover{
        background: #000;
    }
`

class AppearanceController extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            // files: [],
        }
        this.bgColors = null
        this.keyColors = null
        this.gallery = null
        this.onDrop = this.onDrop.bind(this)
        this.preventWheel = this.preventWheel.bind(this)
        this.handleWheelEvent = this.handleWheelEvent.bind(this)
        this.attachPreview = this.attachPreview.bind(this)
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
        this.props.saveFile(files)
    }
    attachPreview(idx){
        this.props.triggerAttachCall(idx)
    }
    componentDidMount(){
        this.preventWheel(this.bgColors)
        this.preventWheel(this.keyColors)
        this.preventWheel(this.gallery)
    }
    componentDidUpdate(){
        this.preventWheel(this.bgColors)
        this.preventWheel(this.keyColors)
        this.preventWheel(this.gallery)
    }
    render(){
        return (
            <Panel>
                <Palette height="135">
                    <Palette.Title>배경테마</Palette.Title>
                    <Palette.Colors ref={node => this.bgColors = node}>
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
                    <Palette.Title>
                        <span>그래프 색상</span>
                        <StyledCheckbox reverse={true} label='컬러 대비' onChange={(e,value) => console.log(value.checked)}/>
                    </Palette.Title>
                    <Palette.Colors ref={node => this.keyColors = node}>
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
                <ImageSection>
                    <Panel.Title>
                        <span>이미지</span>
                    </Panel.Title>
                    <ImageSection.Content ref={node => this.gallery = node}>
                        {
                            this.props.files.length == 0 &&
                            <FileUploader onDrop={this.onDrop}>
                                {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
                                    return (<FileUploader.Zone active={isDragActive}/>)
                                }}
                            </FileUploader>
                        }

                        <ImageGrid>
                            {this.props.files.length > 0 &&
                                <FileUploader.StandAlone onDrop={this.onDrop}>
                                    {({isDragActive, isDragReject, acceptedFiles, rejectedFiles}) => {
                                        return (<FileUploader.Zone active={isDragActive}/>)
                                    }}
                                </FileUploader.StandAlone>
                            }
                            {this.props.files.map((file, i)=>(
                                <ImageGrid.Item key={i} onClick={()=>this.attachPreview(i)}>
                                    <img src={file.preview}/>
                                </ImageGrid.Item>

                            ))}
                        </ImageGrid>
                    </ImageSection.Content>

                </ImageSection>
            </Panel>
        )
    }
}
export default AppearanceController