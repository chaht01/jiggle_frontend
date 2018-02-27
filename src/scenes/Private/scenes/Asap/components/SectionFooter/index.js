import React from 'react'
import styled from 'styled-components'

const FooterMask = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    clip: rect(0, auto, auto, 0);
    pointer-events: none;
`

const Footer = styled.div`
    position: fixed;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    left: 0;
    bottom: 0;
    top: auto;
    width: 100%;
    height: 50px;
    padding: 0 3rem;
    background: #000;
    z-index: 202;
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: transform;
    perspective: 1000;
    pointer-events: all;
`



const SectionFooter = ({children}) => {
    return(
        <FooterMask>
            <Footer>{children}</Footer>
        </FooterMask>
    )
}

export default SectionFooter