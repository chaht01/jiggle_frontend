import React from 'react'

import styled from 'styled-components'

const FullPageStyled = styled.div`
    width:100%;
    height: 100%;
`

const FullPage = ({children, ...rest}) => {
    return (
        <FullPageStyled {...rest}>
            {children}
        </FullPageStyled>
    )
}

export default FullPage
