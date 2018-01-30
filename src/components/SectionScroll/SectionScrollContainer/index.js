import React from 'react'

import FullPage from '../../Layout/FullPage'

import styled from 'styled-components'

const FullPageScrollable = styled(FullPage)`
    position: relative;
    overflow: auto;
`

class SectionScrollContainer extends React.Component{
    render(){
        return (
            <FullPageScrollable>
                {this.props.children}
            </FullPageScrollable>
        )
    }
}

export default SectionScrollContainer
