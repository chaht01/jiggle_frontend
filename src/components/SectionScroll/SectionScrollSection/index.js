import React from 'react'
import FullPage from '../../Layout/FullPage'
import styled from 'styled-components'

const StyledFullPage = styled(FullPage)`
    position: relative;
    padding-top: ${props => props.height};
`

const SectionScrollSection = ({children, spyHeight, activateSection, ...rest}) => {
    return (
        <StyledFullPage height={spyHeight}>
            {
                Array.isArray(children) ?
                    children.map((child, i) => {
                        return (
                            React.cloneElement(child, Object.assign({}, {activateSection}, {key: i}, child.props))
                        )
                    })
                    : React.cloneElement(children, Object.assign({}, {activateSection}, children.props))
            }
        </StyledFullPage>
    )
}

export default SectionScrollSection
