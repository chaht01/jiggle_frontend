import React from 'react'
import styled from 'styled-components'

import media from '../../../config/media'
import viewport from '../../../config/viewport'
import config from './config'

const AppBarRepresentation = styled.div`
    position: fixed;
    display: flex;
    justify-content: center;
    width: 100%;
    height: ${config('height')};
    top:0;
    z-index: 1000;
`

const AppBarInner = styled.div`
    display: flex;
    align-items: center;
    width: ${viewport.desktop}px;
    ${media.desktop`width: 100%;`}
    height: 100%;
    margin: 0 auto;
    padding: 0 5rem;
    ${media.tablet`
        padding: 0 1rem;
    `}
`

const AppBar = ({children, ...rest}) => {
    return (
        <AppBarRepresentation {...rest}>
            <AppBarInner {...rest}>
                {children}
            </AppBarInner>
        </AppBarRepresentation>
    )
}


export default AppBar
