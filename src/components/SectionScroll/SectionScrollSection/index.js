import React from 'react'
import FullPage from '../../Layout/FullPage'
import styled from 'styled-components'

const StyledFullPage = styled(FullPage)`
    padding-top: ${props => props.height};
`

const SectionScrollSection = ({children, active, spyHeight, ...rest}) => {
    return (
        <StyledFullPage height={spyHeight}>{children}</StyledFullPage>
    )
}

export default SectionScrollSection
