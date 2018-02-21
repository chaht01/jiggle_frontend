import React from 'react'

import styled, {ThemeProvider} from 'styled-components'


import {Input as SemanticInput } from 'semantic-ui-react'

const theme = {
    fg: '#18181b', //foreground color(text)
    pc: '#65696A', //placeholder color
    bg: '#fff', //background color
    bc: '#FA4D1E' //border color
}

const invertTheme = ({fg, pc, bg, bc}) => ({
    fg: bg,
    pc: pc,
    bg: fg,
    bc: bc,
})

const StyledInput = styled(SemanticInput)`
    >input{
        ${props => props.square ? 'border-radius: 0 !important;' : ''}
        color: ${props => props.theme.fg} !important;
        background: ${props => props.theme.bg} !important;
        &:focus{
            border-color: ${props => props.theme.bc} !important;
        }
    }
    >input::placeholder{
        color: ${props => props.theme.pc} !important;
    }
    
    
`
const mergeObject = (...options) => {
    return Object.assign({}, ...options)
}

const Input = ({theme: userDefinedTheme, invert, square, ...rest}) => {
    return (
        <ThemeProvider theme={invert ? invertTheme(mergeObject(theme, userDefinedTheme)) : (mergeObject(theme, userDefinedTheme))}>
            <StyledInput square={square ? 'true':undefined} {...rest}/>
        </ThemeProvider>
    )
}

export default Input
