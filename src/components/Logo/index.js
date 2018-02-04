import React from 'react'

/* COMPONENTS */
import { Link } from 'react-router-dom'

/* STYLES */
import styled from 'styled-components'

const LogoContainer = styled.div`
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    flex: 1;
    height: 100%;
`
const Logo = ({children, ...rest}) => {
    return (
        <LogoContainer>
            <Link {...rest}>
                {children}
            </Link>
        </LogoContainer>
    )
}


export default Logo
