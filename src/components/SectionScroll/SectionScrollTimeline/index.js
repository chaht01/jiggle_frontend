import React from 'react'

import styled from 'styled-components'

const Timeline = styled.div`
    position: fixed;
    left: 0;
    top: 60px;
    width: 100%;
    height: 50px;
`

const Anchor = styled.a`
    text-decoration: none;
    color: #222;
    cursor: pointer;
`


const SectionScrollTimeline = () => {
    return (
        <Timeline>
            <Anchor>hello</Anchor>
        </Timeline>
    )
}

export default SectionScrollTimeline
