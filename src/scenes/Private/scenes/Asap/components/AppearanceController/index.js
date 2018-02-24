import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import StackGrid from 'react-stack-grid'
import Checkbox from '../../../../../../components/Checkbox'
import { saveColor, saveTheme} from '../../sagas/actions'
import { colorsByType, colorToPalette, Swatch } from '../../config/common'
import connect from "react-redux/es/connect/connect";
import {TEMPLATE, THEME} from "../../config/types";
import * as _ from "lodash";

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
    padding: 15px 0 50px 0;
    -webkit-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    -moz-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    z-index: 201;
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
    margin: 4px;
    border-radius: 10px;
    background: #e0e0e0;
    box-shadow: ${props => {
        const [r,g,b] = Swatch.hexToRgb(props.color)
        return props.active ? 
            'rgba('+r+', '+g+', '+b+', 0.75) 0px 0px 0px 3px;' 
            : '0px 2px 18px -1px rgba(0,0,0,0.6)'}};
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

const Tab = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
`
Tab.Item = styled.a`
    display: flex;
    cursor: pointer;
    height:100%;
    color: ${props => props.active ? '#fff' : '#848484'};
    &:hover{
        color: #fff;
    }
    font-size: 0.8rem;
    justify-content:center;
    align-items: center;
    text-decoration: none;
    padding: 0 .5rem;
`



const mapStateToProps = (state, ownProps) => {
    return {
        templateType: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
        mask: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.safeMask,
        theme: state.PrivateReducer.AsapReducer.procedureManager.appearance.theme,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveColor: (color) => dispatch(saveColor(color)),
        saveTheme: (theme) => dispatch(saveTheme(theme)),
    }
}

class AppearanceControllerRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            colorTabs: [],
            theme: {
                colors: Object.keys(THEME).map((key) => {
                    return THEME[key]
                }),
                selected: Object.keys(THEME).map(key => _.isEqual(THEME[key], this.props.theme)).indexOf(true)
            }
        }
        const colorObj = colorsByType(this.props.templateType)
        this.state.colorTabs = this.buildColorTab(colorObj)

        this.props.saveColor(this.getPalette())


        this.bgColors = null
        this.keyColors = null
        this.gallery = null
        this.onDrop = this.onDrop.bind(this)
        this.preventWheel = this.preventWheel.bind(this)
        this.handleWheelEvent = this.handleWheelEvent.bind(this)
        this.attachPreview = this.attachPreview.bind(this)
        this.activeTab = this.activeTab.bind(this)
        this.selectColor = this.selectColor.bind(this)
        this.getSelectedColor = this.getSelectedColor.bind(this)
    }
    buildColorTab(colorObj){
        const keyMap = {
            emphasis: '강조',
            single: '단일',
            similar: '유사',
            contrast: '대비'
        }
        let colorTabs = []
        Object.keys(colorObj).forEach(function(key,index) {
            const tab = {
                label: keyMap[key],
                active: index == 0, // if tab is activated
                selected: index==0 ? 0: -1, //selected Color idx
                colors: colorObj[key]
            }
            colorTabs.push(tab)
        })
        return colorTabs
    }
    activeTab(idx){
        this.setState((prevState)=>{
            let newTabs = prevState.colorTabs.slice()
            return {
                colorTabs: newTabs.map((tab,t_idx) => {
                    tab.active = idx == t_idx
                    return tab
                })
            }
        })
    }
    getSelectedColor(){
        const activatedTab = this.state.colorTabs.filter((tab, t_idx)=> tab.active)[0]
        return activatedTab.colors.filter((color, c_idx)=> c_idx == activatedTab.selected)[0]
    }
    getPalette(color){
        if(this.props.mask === null || this.props.mask.length==0){
            return []
        }
        const {mask} = this.props.mask
        const {templateType} = this.props
        if(color===undefined || color===null || !(color instanceof Swatch)){
            color = this.getSelectedColor()
        }

        return colorToPalette(color, templateType, mask)
    }
    selectColor(idx, color){
        this.setState((prevState)=> {
            let newTabs = prevState.colorTabs.slice()
            return {
                ...prevState,
                colorTabs: newTabs.map((tab, t_idx) => {
                    tab.selected = tab.active ? idx : -1
                    return tab
                })
            }
        }, ()=>this.props.saveColor(this.getPalette(color)))


    }
    selectTheme(idx){
        this.setState((prevState)=>{
            return {
                ...prevState,
                theme: {
                    ...prevState.theme,
                    selected: idx
                }
            }
        }, ()=>{
            this.props.saveTheme(this.state.theme.colors[idx])
        })
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
    componentWillReceiveProps(nextProps){
        if(!_.isEqual(this.props.templateType, nextProps.templateType)){
            this.setState({
                colorTabs: this.buildColorTab(colorsByType(nextProps.templateType))
            }, () => this.props.saveColor(this.getPalette()))
        }

    }
    render(){
        return (
            <Panel>
                <Palette height="135">
                    <Palette.Title>배경테마</Palette.Title>
                    <Palette.Colors ref={node => this.bgColors = node}>
                        {
                            this.state.theme.colors.map((theme, theme_idx) => {
                                const selected = theme_idx === this.state.theme.selected
                                return (
                                    <Color key={theme_idx}
                                           color={theme.backgroundColor}
                                           active={selected}
                                           onClick={()=>this.selectTheme(theme_idx)}
                                    />
                                )
                            })
                        }
                    </Palette.Colors>
                </Palette>
                <Palette height="190">
                    <Palette.Title>
                        <span>그래프 색상</span>
                        {/*<StyledCheckbox reverse={true} label='컬러 대비' onChange={(e,value) => console.log(value.checked)}/>*/}
                    </Palette.Title>
                    <Tab>
                        {this.state.colorTabs.map((tab, i)=> {
                            return (
                                <Tab.Item key={i} active={tab.active} onClick={()=>this.activeTab(i)}>{tab.label}</Tab.Item>
                            )
                        })}
                    </Tab>
                    <Palette.Colors ref={node => this.keyColors = node}>
                        {
                            this.state.colorTabs.filter(tab => tab.active)[0].colors.map((color, c_i) => {
                                const selected = this.state.colorTabs.filter(tab => tab.active)[0].selected == c_i
                                return(
                                    <Color key={c_i}
                                           active={selected}
                                           color={color.start}
                                           onClick={()=>this.selectColor(c_i, color)}/>
                                )
                            })
                        }
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

const AppearanceController = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppearanceControllerRepresentation)

export default AppearanceController