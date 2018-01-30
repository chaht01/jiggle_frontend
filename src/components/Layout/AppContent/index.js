import React from 'react'
import styled from 'styled-components'

const AppContentOuter = styled.div`
    position: relative;
    width: 100%;
    padding-top: 60px;
    background: #fff;
    height: 100%;
    
`
const AppContentInner = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
`

const AppContent = ({children, ...rest}) => (
    <AppContentOuter>
        <AppContentInner rest>
            {children}
        </AppContentInner>
    </AppContentOuter>
)
export default AppContent
