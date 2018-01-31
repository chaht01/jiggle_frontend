import React from 'react'

import styled from 'styled-components'

const Spy = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    padding: 0 2rem;
    left: 0;
    top:0;
    width: 100%;
    height: ${props => props.height};
    background: rgba(255, 255, 255, ${props => props.direction=='idle' ? 1 : 0.5});
    z-index:9999;
    transition: all .5s;
    box-shadow: 0 12px 49px -18px rgba(0,0,0,${props => props.direction != 'idle' ? 0.3 : 0});
    
`

const Anchor = styled.a`
    position: relative;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: ${props => props.dim ? '#e1e1e7 !important' : (props.active ? '#428bca' : '#222')};
    cursor: pointer;
    margin: 0 1rem;
    height: 100%;
    &:after{
        content:'';
        display: block;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 0.3rem;
        background-color: ${props => props.dim ? 'transparent !important' : (props.active ? '#428bca' : 'transparent')};
    }
`


const SectionScrollSpy = ({items, active, activateSection, activeAnchorLength, direction, spyHeight, ...rest}) => {
    return (
        <Spy direction={direction} height={spyHeight}>
            {items.map((item, i)=>(
                <Anchor key={i} onClick={()=>activateSection(i)} active={i==active} dim={activeAnchorLength<=i}>{item}</Anchor>
            ))}
        </Spy>
    )
}

export default SectionScrollSpy
