import React from 'react'

import styled from 'styled-components'

const Spy = styled.div`
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 50px;
`

const Anchor = styled.a`
    text-decoration: none;
    color: ${props => props.dim ? '#e1e1e7 !important' : (props.active ? '#428bca' : '#222')};
    text-decoration: ${props => props.dim ? 'none !important' :  props.active ? 'underline' : 'none'};
    cursor: pointer;
    &:hover{
        text-decoration: underline;
    }
`


const SectionScrollSpy = ({items, active, activateSection, activeAnchorLength, ...rest}) => {
    return (
        <Spy>
            {items.map((item, i)=>(
                <Anchor key={i} onClick={()=>activateSection(i)} active={i==active} dim={activeAnchorLength<=i}>{item}</Anchor>
            ))}
        </Spy>
    )
}

export default SectionScrollSpy
