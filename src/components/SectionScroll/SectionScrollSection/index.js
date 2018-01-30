import React from 'react'
import FullPage from '../../Layout/FullPage'
import styled from 'styled-components'

const StyledFullPage = styled(FullPage)`
    padding-top: 50px
`

const SectionScrollSection = ({children, ...rest}) => {
    return (
        <StyledFullPage>{children}</StyledFullPage>
    )
}

export default SectionScrollSection
