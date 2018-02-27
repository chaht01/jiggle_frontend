import parseBar from '../../../../../components/core/src/parser/bar-parser'
import horizontalBarParser from '../../../../../components/core/src/parser/horizontal-bar-parser'
import groupedBarParser from '../../../../../components/core/src/parser/grouped-bar-parser'
import BarFactory from "../../../../../components/core/src/factory/bar-factory"
import HorizontalBarFactory from "../../../../../components/core/src/factory/horizontal-bar-factory"
import GroupedBarFactory from "../../../../../components/core/src/factory/grouped-bar-factory"
import LargeDataLineFactory from "../../../../../components/core/src/factory/large-line-factory"
import SmallDataLineFactory from "../../../../../components/core/src/factory/small-line-factory"
import {TEMPLATE} from './types'
import * as _ from "lodash";
import {rgbToHex, rgbToHsl, hexToRgb, hslToRgb} from '../../../../../utils/colors'



const validColor = (hexStr) => {
    return /^#[0-9A-F]{6}$/i.test(hexStr)
}

export class Swatch {
    constructor(start, end, max=Infinity){
        this.start = start
        this.end = end
        this.max = max
    }
    isValidColor (hexStr) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexStr)
    }

    getPalette (tweenNum, rgbTween=true) {
        tweenNum = Math.min(tweenNum, this.max)
        if(rgbTween){
            if(this.isValidColor(this.start) && this.isValidColor(this.end)){
                const startRgb = Swatch.hexToRgb(this.start)
                const endRgb = Swatch.hexToRgb(this.end)
                const diff = [endRgb[0]-startRgb[0], endRgb[1]-startRgb[1], endRgb[2]-startRgb[2]]
                let ret = []
                if(tweenNum>=2){
                    for(let i=0; i<tweenNum-1; i++){
                        const newHex = Swatch.rgbToHex(
                            startRgb[0] + parseInt((diff[0]/(tweenNum-1))*i),
                            startRgb[1] + parseInt((diff[1]/(tweenNum-1))*i),
                            startRgb[2] + parseInt((diff[2]/(tweenNum-1))*i)
                        )
                        ret.push(newHex)
                    }
                    ret.push(this.end)
                }else if(tweenNum==1){
                    ret.push(this.start)
                }
                return ret
            }
        }else{
            if(this.isValidColor(this.start)){
                const startHsl = Swatch.rgbToHsl.apply(this, Swatch.hexToRgb(this.start))
                const diff = 10 - startHsl[2] //threshold point: 10%
                let ret = []
                for(let i=0; i<tweenNum; i++){
                    const newHex = Swatch.rgbToHex.apply(this, Swatch.hslToRgb(
                        parseInt(startHsl[0]), parseInt(startHsl[1]), parseInt(startHsl[2]+i*diff/tweenNum)
                    ))
                    ret.push(newHex)
                }

                return ret
            }
        }
        throw "Invalid rgb color format"
    }
    static rgbToHex = rgbToHex
    static hexToRgb = hexToRgb
    static rgbToHsl = rgbToHsl
    static hslToRgb = hslToRgb
}

export const colorToPalette = (color, type, masks, rgbTween=true) => {
    if(!(color instanceof Swatch)){
        return []
    }
    let len = 1
    switch (type){
        case TEMPLATE.BAR:
        case TEMPLATE.BAR_HORIZONTAL:
        case TEMPLATE.BAR_EMPHASIS:
        case TEMPLATE.BAR_HORIZONTAL_EMPHASIS:
            len = masks[masks.length-1].length-1 // # of axis col
            break
        case TEMPLATE.BAR_GROUPED:
        case TEMPLATE.LINE:
        case TEMPLATE.LINE_DENSE:
            len = masks[masks.length-1][0].length-1 // # of legends
            break
    }
    return color.getPalette(len, rgbTween)
}

export const colorsByType = (type) => {
    let ret = {} // key: contrast, similar, single, emphasis
    switch (type){
        case TEMPLATE.BAR:
        case TEMPLATE.BAR_GROUPED:
        case TEMPLATE.BAR_HORIZONTAL:
        case TEMPLATE.LINE:
            ret.similar = [new Swatch('#dd6b4b', '#e5a248'), new Swatch('#7d9ec9', '#416299'), new Swatch('#e5a248', '#c5cc32')]
            ret.contrast = [new Swatch('#dd6b4b', '#4299bc'), new Swatch('#7d9ec9', '#835f96'), new Swatch('#e5a248', '#519baf')]
            ret.single = [new Swatch('#dd6b4b', '#dd6b4b'), new Swatch('#7d9ec9', '#7d9ec9'), new Swatch('#e5a248', '#e5a248')]
            break
        case TEMPLATE.LINE_DENSE:
            ret.single = [new Swatch('#dd6b4b', '#dd6b4b'), new Swatch('#7d9ec9', '#7d9ec9'), new Swatch('#e5a248', '#e5a248')]
            break
        case TEMPLATE.BAR_EMPHASIS:
        case TEMPLATE.BAR_HORIZONTAL_EMPHASIS:
            ret.emphasis = [new Swatch('#dd6b4b', '#b5b5b5', 2), new Swatch('#7d9ec9', '#b5b5b5', 2), new Swatch('#e5a248', '#b5b5b5', 2)]
            break
    }
    return ret
}

export const getDefaultSwatch = (type) => {
    const colorObj = colorsByType(type)
    const swatch = colorObj[Object.keys(colorObj)[0]][0]
    return swatch
}


export const defaultSettings = (width, mask, meta, color) => {
    const {title, subtitle, reference, madeBy, unit} = meta
    return _.cloneDeep({
        rawData: mask,
        width_svg: width,
        height_svg: width*9/16,
        graph_colors: color,
        title,
        subtitle,
        reference,
        madeBy,
        unit
    })
}

export const getFactory = (type, mask, meta, templateConfig, width, color, theme, comments=[], breakPoint=-1) => {
    let settings = []
    let charts = []
    let factory = null
    if(comments.length==0 || mask.length!=comments.length){
        console.error('Warning: comments not given while using getFactory method. Comments will extend along with mask size')
        let resLen = mask.length - comments.length
        while(resLen){
            resLen--
            comments.push([])
        }
    }

    switch (type){
        case TEMPLATE.BAR:
        case TEMPLATE.BAR_HORIZONTAL:
            settings = [defaultSettings(width, mask[0], meta, color)]
            break;
        case TEMPLATE.BAR_EMPHASIS:
        case TEMPLATE.BAR_HORIZONTAL_EMPHASIS:
            settings = mask.map(m => {
                return defaultSettings(width, m, meta, [color[1]])
            })
            if(settings.length>1){
                settings[1].colorToFocus = color[0]
                settings[1].indexToFocus = [breakPoint-1]
            }
            break;
        case TEMPLATE.BAR_GROUPED:
            settings = [defaultSettings(width, mask[0], meta, color)]
            break;
        case TEMPLATE.LINE:
            settings = mask.map(m => {
                const settingsForLine = Object.assign({}, defaultSettings(width, m, meta, color), {delay:1000, duration:1000})
                return settingsForLine
            })
            break;
        case TEMPLATE.LINE_DENSE:
            settings = mask.map(m => {
                const settingsForLine = Object.assign({}, defaultSettings(width, m, meta, color), {delay:1000, duration:1000})
                return settingsForLine
            })
            break;
    }
    charts = settings.map((setting, i) => {
        return Object.assign({}, templateConfig, {theme}, {label:comments[i]}, setting)
    })

    switch (type){
        case TEMPLATE.BAR:
        case TEMPLATE.BAR_EMPHASIS:
            charts.forEach(chart => parseBar(chart));
            factory = new BarFactory();
            break;
        case TEMPLATE.BAR_HORIZONTAL:
        case TEMPLATE.BAR_HORIZONTAL_EMPHASIS:
            charts.forEach(chart => horizontalBarParser(chart));
            factory = new HorizontalBarFactory();
            break;
        case TEMPLATE.BAR_GROUPED:
            charts.forEach(chart => groupedBarParser(chart));
            factory = new GroupedBarFactory();
            break;
        case TEMPLATE.LINE:
            factory = new SmallDataLineFactory();
            break;
        case TEMPLATE.LINE_DENSE:
            factory = new LargeDataLineFactory();
            break;
    }
    return {charts, factory}
}