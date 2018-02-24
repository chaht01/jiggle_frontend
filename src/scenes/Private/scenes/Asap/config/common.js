import parseBar from 'd3-reusable/src/parser/bar-parser'
import horizontalBarParser from 'd3-reusable/src/parser/horizontal-bar-parser'
import groupedBarParser from 'd3-reusable/src/parser/grouped-bar-parser'
import BarFactory from "d3-reusable/src/factory/bar-factory"
import HorizontalBarFactory from "d3-reusable/src/factory/horizontal-bar-factory"
import GroupedBarFactory from "d3-reusable/src/factory/grouped-bar-factory"
import LargeDataLineFactory from "../../../../../components/core/src/factory/large-line-factory"
import SmallDataLineFactory from "../../../../../components/core/src/factory/small-line-factory"
import {TEMPLATE} from './types'
import * as _ from "lodash";



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
    static rgbToHex(r, g, b){
        return '#'+r.toString(16)+g.toString(16)+b.toString(16)
    }
    static hexToRgb(hexStr){
        let _r = parseInt(hexStr.slice(1, 3), 16)
        let _g = parseInt(hexStr.slice(3, 5), 16)
        let _b = parseInt(hexStr.slice(5, 7), 16)
        return [_r, _g, _b]
    }
    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [ h, s, l ];
    }
    static hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [ r * 255, g * 255, b * 255 ];
    }
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
            ret.similar = [new Swatch('#dd6b4b', '#e5a248'), new Swatch('#7d9ec9', '#416299'), new Swatch('#5a72b7', '#5a9baf')]
            ret.contrast = [new Swatch('#dd6b4b', '#4299bc'), new Swatch('#7d9ec9', '#835f96'), new Swatch('#5a72b7', '#e5a248')]
            ret.single = [new Swatch('#dd6b4b', '#dd6b4b', 1), new Swatch('#7d9ec9', '#7d9ec9', 1), new Swatch('#5a72b7', '#5a72b7', 1)]
            break
        case TEMPLATE.LINE_DENSE:
            ret.single = [new Swatch('#dd6b4b', '#dd6b4b', 1), new Swatch('#7d9ec9', '#7d9ec9', 1), new Swatch('#5a72b7', '#5a72b7', 1)]
            break
        case TEMPLATE.BAR_EMPHASIS:
        case TEMPLATE.BAR_HORIZONTAL_EMPHASIS:
            ret.emphasis = [new Swatch('#dd6b4b', '#b5b5b5', 2), new Swatch('#7d9ec9', '#b5b5b5', 2), new Swatch('#5a72b7', '#b5b5b5', 2)]
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
    charts = settings.map((setting) => {
        return Object.assign({}, templateConfig, {theme}, {label:comments}, setting)
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