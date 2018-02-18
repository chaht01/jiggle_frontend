import React from 'react'
import {Button as SemanticButton} from 'semantic-ui-react'

import styled, {ThemeProvider} from 'styled-components'


const theme = {
    fg: '#222', //foreground color(text)
    bg: '#fff', //background color
}

const size = {
    tiny: {
        fontSize: 10,
    },
    small: {
        fontSize: 12,
    },
    normal: {
        fontSize: 14,
    }
}

const invertTheme = ({fg, bg}) => ({
    fg: bg,
    bg: fg,
})

const StyledButton = styled(SemanticButton)`
    border-radius: ${props => props.rounded ? '100px' : '2px'} !important;
    color: ${props => props.theme.fg} !important;
    background: ${props => props.theme.bg} !important;
    font-size: ${props => size[props.size || 'normal'].fontSize}px !important;
    font-weight: 500 !important;
    padding: 0.7857em 1.6428em 0.7857em !important;
    margin: 0 0.8214em !important;
`
const mergeObject = (...options) => {
    return Object.assign({}, ...options)
}

const Button = ({theme: userDefinedTheme, rounded, size, ...rest}) => {
    return (
        <ThemeProvider theme={mergeObject(theme, userDefinedTheme)}>
            <StyledButton rounded={rounded ? 'true':undefined} {...rest} size={size}/>
        </ThemeProvider>
    )
}

export default Button
