import React from 'react'

import styled from 'styled-components'

import media from '../../../config/media'
import viewport from '../../../config/viewport'

const Spy = styled.div`
    position: absolute;
    left: 0;
    top:0;
    width: 100%;    
    height: ${props => props.height};
    background: rgba(15, 16, 17, ${props => props.direction=='idle' ? 1 : 0.5});
    z-index:1000;
    transition: all .5s;
    box-shadow: 0 12px 49px -18px rgba(0,0,0,${props => props.direction != 'idle' ? 0.3 : 0});
    
`

const Anchor = styled.a`
    position: relative;
    display: flex;
    align-items: flex-end;
    text-decoration: none;
    color: ${props => props.dim ? '#2c2e30 !important' : (props.active ? '#C7C8CA' : '#474B4E')};
    cursor: pointer;
    margin-right: 1.5rem;
    height: 100%;
    padding-bottom: 4px;
    &:hover{
        color: ${props=> !props.dim && '#FA4D1E !important;'}
        &:after{
            background: ${props => props.active && '#FA4D1E !important;'}
        }
    }
    &:after{
        content:'';
        display: block;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: ${props => props.dim ? 'transparent !important' : (props.active ? '#898A8B' : 'transparent')};
    }
`

const AnchorContainer = styled.div`
    display: flex;
    align-items: flex-end;
    padding: 0 5rem;
    
    width: ${viewport.desktop}px;
    height: 100%;
    margin: 0 auto;
    ${media.desktop`width:100%;`}
`

const SectionScrollSpy = ({items, active, activateSection, activeAnchorLength, direction, spyHeight, children, ...rest}) => {
    return (
        <Spy direction={direction} height={spyHeight}>
            <AnchorContainer>
                {items.map((item, i)=>(
                    <Anchor key={i} onClick={()=>activateSection(i)} active={i==active} dim={activeAnchorLength<=i}>{item}</Anchor>
                ))}
                {children}
            </AnchorContainer>

        </Spy>
    )
}

export default SectionScrollSpy
