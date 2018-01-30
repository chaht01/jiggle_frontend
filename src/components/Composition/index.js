import React from 'react'
import styled from 'styled-components'

const CompositionContainer = styled.div`
    position: relative;
    width: 100%;
    padding-top: ${9/16*100}%;
`

const CompositionInner = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
`

const Composition = ({children, ...rest}) => {
    return(
        <CompositionContainer {...rest}>
            <CompositionInner>
                {children}
            </CompositionInner>
        </CompositionContainer>
    )
}

export default Composition
