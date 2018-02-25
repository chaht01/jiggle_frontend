import React from 'react'
import {Button as SemanticButton} from 'semantic-ui-react'

import styled, {ThemeProvider} from 'styled-components'

import tinycolor from 'tinycolor2'

const theme = {
    fg: '#222', //foreground color(text)
    bg: '#fff', //background color
    bc: 'transparent'
}

const size = {
    mini: {
        fontSize:8,
    },
    tiny: {
        fontSize: 10,
    },
    small: {
        fontSize: 12,
    },
    medium: {
        fontSize: 14,
    },
    large: {
        fontSize: 16
    },
    big: {
        fontSize: 18
    },
    huge: {
        fontSize: 20
    },
    massive: {
        fontSize: 22
    }

}

const invertTheme = ({fg, bg, bc}) => ({
    fg: fg,
    bg: bc,
    bc: bg
})

const StyledButton = styled(SemanticButton)`
    border-radius: ${props => props.rounded ? '100px' : '2px'} !important;
    color: ${props => props.theme.fg} !important;
    background: ${props => props.theme.bg} !important;
    font-size: ${props => size[props.size || 'medium'].fontSize}px !important;
    font-weight: 500 !important;
    padding: 0.7857em 1.6428em 0.7857em !important;
    margin: 0 0.8214em !important;
    box-shadow: 0 0 0 1px ${props => props.theme.bc} inset!important;
    transition: all .2s !important;
    &:hover{
        background: ${props => tinycolor(props.theme.bg).darken().toString()} !important;
        box-shadow: 0 0 0 1px ${props => tinycolor(props.theme.bc).darken().toString()} inset, 0px 0px 6px -1px rgba(100,100,100,0.6) !important;
    }
`
const mergeObject = (...options) => {
    return Object.assign({}, ...options)
}

const Button = ({theme: userDefinedTheme, rounded, size, inverted, ...rest}) => {
    return (
        <ThemeProvider theme={inverted ? invertTheme(mergeObject(theme, userDefinedTheme)) : mergeObject(theme, userDefinedTheme)}>
            <StyledButton rounded={rounded ? 'true':undefined} {...rest} size={size}/>
        </ThemeProvider>
    )
}

export default Button
