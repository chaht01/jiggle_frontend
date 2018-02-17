import React from 'react'
import styled from 'styled-components'

const Transformable = styled.rect`
    cursor:pointer;
    stroke: blue;
    fill:transparent;
    stroke-width:2;       
`
const TransformAnchor = styled.rect`
    cursor: ${props => props.cursor};
    fill: #fff;
    stroke: blue;
    stroke-width:1;
`
class Resizeable extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            appearance:{
                width: this.props.width || 100,
                height: this.props.height || 100,
                x: this.props.x || 100,
                y: this.props.y || 100,
            }

        }
        this.transform = this.transform.bind(this)
    }

    componentWillReceiveProps(nextProps){
        if(this.props.focused){
            if(this.props.anchorIdx!=-1){
                this.setState({
                    appearance: this.transform(this.props, {width:100, height:100, x:100, y:100}, this.props.anchorIdx, nextProps.diff)
                })
            }else{
                this.setState({
                    appearance:{
                        x: this.props.x,
                        y: this.props.y,
                        width: this.props.width,
                        height: this.props.height
                    }
                })
            }
        }
    }

    transform(prevAppearance, defaultAppearance, anchorIdx, diff){
        switch (anchorIdx){
            case 0:
                return {
                    width: Math.max(0,(prevAppearance.width||defaultAppearance.width) - diff.x),
                    height: Math.max(0,(prevAppearance.height||defaultAppearance.height) - diff.y),
                    x: (prevAppearance.x||defaultAppearance.x) + (Math.max(0,(prevAppearance.width||defaultAppearance.width) - diff.x)==0 ? 0 : diff.x),
                    y: (prevAppearance.y||defaultAppearance.y) + (Math.max(0,(prevAppearance.height||defaultAppearance.height) - diff.y)==0 ? 0 : diff.y)
                }
            case 1:
                return {
                    width: Math.max(0, (prevAppearance.width||defaultAppearance.width)),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height) - diff.y),
                    x: (prevAppearance.x||defaultAppearance.x),
                    y: (prevAppearance.y||defaultAppearance.y) + (Math.max(0, (prevAppearance.height||defaultAppearance.height) - diff.y)==0 ? 0 : diff.y)
                }
            case 2:
                return {
                    width: Math.max(0,(prevAppearance.width||defaultAppearance.width) + diff.x),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height) - diff.y),
                    x: (prevAppearance.x||defaultAppearance.x),
                    y: (prevAppearance.y||defaultAppearance.y) + (Math.max(0, (prevAppearance.height||defaultAppearance.height) - diff.y)==0 ? 0 : diff.y)
                }
            case 3:
                return {
                    width: Math.max(0, (prevAppearance.width||defaultAppearance.width) + diff.x),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height)),
                    x: (prevAppearance.x||defaultAppearance.x),
                    y: (prevAppearance.y||defaultAppearance.y)
                }
            case 4:
                return {
                    width: Math.max(0, (prevAppearance.width||defaultAppearance.width) + diff.x),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height) + diff.y),
                    x: (prevAppearance.x||defaultAppearance.x),
                    y: (prevAppearance.y||defaultAppearance.y)
                }
            case 5:
                return {
                    width: Math.max(0, (prevAppearance.width||defaultAppearance.width)),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height) + diff.y),
                    x: (prevAppearance.x||defaultAppearance.x),
                    y: (prevAppearance.y||defaultAppearance.y)
                }
            case 6:
                return {
                    width: Math.max(0, (prevAppearance.width||defaultAppearance.width) - diff.x),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height) + diff.y),
                    x: (prevAppearance.x||defaultAppearance.x) + (Math.max(0, (prevAppearance.width||defaultAppearance.width) - diff.x)==0 ? 0 : diff.x),
                    y: (prevAppearance.y||defaultAppearance.y)
                }
            case 7:
                return {
                    width: Math.max(0, (prevAppearance.width||defaultAppearance.width) - diff.x),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height)),
                    x: (prevAppearance.x||defaultAppearance.x) + (Math.max(0, (prevAppearance.width||defaultAppearance.width) - diff.x)==0 ? 0 : diff.x),
                    y: (prevAppearance.y||defaultAppearance.y)
                }
            case 8:
                return {
                    width: Math.max(0, (prevAppearance.width||defaultAppearance.width)),
                    height: Math.max(0, (prevAppearance.height||defaultAppearance.height)),
                    x: (prevAppearance.x||defaultAppearance.x) + (Math.max(0, (prevAppearance.width||defaultAppearance.width))==0 ? 0 : diff.x),
                    y: (prevAppearance.y||defaultAppearance.y) + (Math.max(0, (prevAppearance.height||defaultAppearance.height))==0 ? 0 : diff.y)
                }
        }
    }

    render(){
        const {focused, focus, idx, setAnchorIdx, deleteSelf} = this.props
        const focusSelf = (e, idx) => {
            focus(idx)
            e.stopPropagation()
        }
        const anchorSize = 6
        const closeSize = 16
        const closeOffset = 4
        const anchors = [{
            cursor:"nwse-resize",
            x:this.state.appearance.x + this.state.appearance.width*0 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*0 - anchorSize/2
        },{
            cursor:"ns-resize",
            x:this.state.appearance.x + this.state.appearance.width*0.5 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*0 - anchorSize/2
        },{
            cursor:"nesw-resize",
            x:this.state.appearance.x + this.state.appearance.width*1 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*0 - anchorSize/2
        },{
            cursor:"ew-resize",
            x:this.state.appearance.x + this.state.appearance.width*1 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*0.5 - anchorSize/2
        },{
            cursor:"nwse-resize",
            x:this.state.appearance.x + this.state.appearance.width*1 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*1 - anchorSize/2
        },{
            cursor:"ns-resize",
            x:this.state.appearance.x + this.state.appearance.width*0.5 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*1 - anchorSize/2
        },{
            cursor:"nesw-resize",
            x:this.state.appearance.x + this.state.appearance.width*0 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*1 - anchorSize/2
        },{
            cursor:"ew-resize",
            x:this.state.appearance.x + this.state.appearance.width*0 - anchorSize/2,
            y:this.state.appearance.y + this.state.appearance.height*0.5 - anchorSize/2
        }]
        return(
            <g className="resizeable" onClick={(e)=>focusSelf(e, idx)}
               ref={(node) => this.node = node}>
                <image {...this.state.appearance} href={this.props.href}/>
                {focused &&
                <g>
                    <Transformable {...this.state.appearance}
                                   onMouseDown={(e)=>{
                                       setAnchorIdx(8) //move
                                   }}
                                   onMouseUp={()=>{
                                       setAnchorIdx(-1)
                                   }}/>
                    {anchors.map((anchor, idx)=>(
                        <TransformAnchor key={idx} cursor={anchor.cursor} width={anchorSize} height={anchorSize}
                                         x={anchor.x}
                                         y={anchor.y}
                                         onMouseDown={()=>{
                                             setAnchorIdx(idx)
                                         }}
                                         onMouseUp={()=>{
                                             setAnchorIdx(-1)
                                         }}/>
                    ))}
                    {this.state.appearance.width > closeSize && this.state.appearance.height > closeSize &&
                    <g onClick={()=>deleteSelf(idx)}>
                        <ellipse stroke="#fff" fill="#999999" strokeWidth="1.5"
                                 cx={this.state.appearance.x + this.state.appearance.width - closeSize / 2 - closeOffset}
                                 cy={this.state.appearance.y + closeSize / 2 + closeOffset} rx={closeSize / 2}
                                 ry={closeSize / 2}/>
                        <line stroke="#fff" fill="none" strokeWidth="3"
                              x1={this.state.appearance.x + this.state.appearance.width - (closeSize / 2 + Math.sqrt(closeSize) + closeOffset)}
                              y1={this.state.appearance.y + (Math.sqrt(closeSize)) + closeOffset}
                              x2={this.state.appearance.x + this.state.appearance.width - (Math.sqrt(closeSize) + closeOffset)}
                              y2={this.state.appearance.y + (closeSize / 2 + Math.sqrt(closeSize)) + closeOffset}/>
                        <line stroke="#fff" fill="none" strokeWidth="3"
                              x1={this.state.appearance.x + this.state.appearance.width - (Math.sqrt(closeSize) + closeOffset)}
                              y1={this.state.appearance.y + (Math.sqrt(closeSize)) + closeOffset}
                              x2={this.state.appearance.x + this.state.appearance.width - (closeSize / 2 + Math.sqrt(closeSize) + closeOffset)}
                              y2={this.state.appearance.y + (closeSize / 2 + Math.sqrt(closeSize)) + closeOffset}/>
                    </g>
                    }
                </g>
                }

            </g>
        )
    }
}

export default Resizeable
