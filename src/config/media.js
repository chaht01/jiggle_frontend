import {css} from 'styled-components'

const sizes = {
    desktop: 1440,
    laptop: 1366,
}

const media = Object.keys(sizes).reduce((acc, label) => {
    acc[label] = (...args) => css`
        @media (max-width: ${sizes[label] / 16}em) {
            ${css(...args)}
        }
    `
    return acc
}, {})

export default media
