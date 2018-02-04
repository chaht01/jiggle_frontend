import React from 'react'
import Button from '../../../../../../components/Button'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import PaddedContainer from '../PaddedContainer'

import styled from 'styled-components'

const PreviewContainer = styled.div`
    width: 60rem;
    margin: 0 auto;
`

const PreviewThumbnails = styled(Composition)`
    background: #fff;
`

const FooterStyled = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 2rem;
    width: 100%;
    height: 64px;
    background: #000001;
    left: 0;
    bottom: 0;
    top: auto;
    color: #fff;
`
const Footer = ({activeAnchorLength, direction, ...rest}) => {
    return (
        <FooterStyled>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} disabled={true}>저장하기</Button>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}}>추가작업</Button>
        </FooterStyled>
    )
}
const Preview = () => {
    return (
        <PaddedContainer>
            <FullPage>
                <PreviewContainer>
                    <PreviewThumbnails/>
                </PreviewContainer>
                <Footer/>
            </FullPage>
        </PaddedContainer>

    )
}

export default Preview
