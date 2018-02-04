import {css} from 'styled-components'
import viewport from './viewport'


const media = Object.keys(viewport).reduce((acc, label) => {
    acc[label] = (...args) => css`
        @media (max-width: ${viewport[label] / 16}em) {
            ${css(...args)}
        }
    `
    return acc
}, {})

export default media
