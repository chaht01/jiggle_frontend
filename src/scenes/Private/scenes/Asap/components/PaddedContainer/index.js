import React from 'react'
import styled from 'styled-components'
import FullPage from '../../../../../../components/Layout/FullPage'
import media from '../../../../../../config/media'
import viewport from '../../../../../../config/viewport'

const PaddedContainer = styled(FullPage)`
    display: flex;
    position: relative;
    flex-wrap: wrap;
    width: ${viewport.desktop}px;
    ${media.desktop`width: 100%;`}
    padding: 3rem 5rem;
    margin: 0 auto;
    ${media.mobileL`
        padding: 2rem 3rem;
        justify-content: center;
    `}
`

export default PaddedContainer