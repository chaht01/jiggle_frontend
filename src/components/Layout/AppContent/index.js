import React from 'react'
import styled from 'styled-components'

const AppContentOuter = styled.div`
    position: relative;
    width: 100%;
    padding-top: 60px;
    height: 100%;
`
const AppContentInner = styled.div`
    position: relative;
    display: block;
    width: 100%;
    max-width: ${props=> props.width};
    height: 100%;
    margin: 0 auto;
`

const AppContent = ({children, width, ...rest}) => {
    return (
        <AppContentOuter>
            <AppContentInner width={width} {...rest}>
                {children}
            </AppContentInner>
        </AppContentOuter>
    )
}
export default AppContent
