import parseBar from 'd3-reusable/src/parser/bar-parser'
import groupedBarParser from 'd3-reusable/src/parser/grouped-bar-parser'
import BarFactory from "d3-reusable/src/factory/bar-factory"
import GroupedBarFactory from "d3-reusable/src/factory/grouped-bar-factory"
import LargeDataLineFactory from "../../../../../components/project-md/src/factory/large-line-factory"
import {TEMPLATE} from './types'
import * as _ from "lodash";



const validColor = (hexStr) => {
    return /^#[0-9A-F]{6}$/i.test(hexStr)
}
class Swatch {
    constructor(start, end){
        this.start = start
        this.end = end
    }
    isValidColor(hexStr){
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexStr)
    }
    rgbToHsl(hexStr){
        let _r = parseInt(hexStr.slice(1, 3), 16)/255
        let _g = parseInt(hexStr.slice(3, 5), 16)/255
        let _b = parseInt(hexStr.slice(5, 7), 16)/255

    }
}

export const colors = (type) => {
    let color ={
        start: '#000',
        end: '#fff'
    }
    switch (type){
        case TEMPLATE.BAR:

    }
}




export const defaultSettings = (width, mask, meta) => {
    const {title, subtitle, reference, madeBy} = meta
    return _.cloneDeep({
        type: "vertical",
        rawData: mask,
        duration: 1500,
        width_svg: width,
        height_svg: width*9/16,
        title,
        subtitle,
        reference,
        madeBy
    })
}

export const getFactory = (type, mask, meta, templateConfig, width, comments=[]) => {
    let settings = []
    let charts = []
    let factory = null
    switch (type){
        case TEMPLATE.BAR:
            settings = [defaultSettings(width, mask[0], meta), defaultSettings(width, mask[1], meta)]
            break;
        case TEMPLATE.BAR_EMPHASIS:
            settings = [defaultSettings(width, mask[0], meta), defaultSettings(width, mask[1], meta)]
            break;
        case TEMPLATE.BAR_GROUPED:
            break;
        case TEMPLATE.LINE:
            settings = mask.map(m => {
                const settingsForLine = Object.assign({}, defaultSettings(width, m, meta), {delay:1000, duration:1000})
                return settingsForLine
            })
            break;
        case TEMPLATE.LINE_DENSE:
            break;
    }

    charts = settings.map((setting) => {
        return Object.assign({}, templateConfig, setting)
    })

    switch (type){
        case TEMPLATE.BAR:

            break;
        case TEMPLATE.BAR_EMPHASIS:
            charts.forEach(chart => parseBar(chart));
            factory = new BarFactory();
            break;
        case TEMPLATE.BAR_GROUPED:
            charts.forEach(chart => groupedBarParser(chart));
            factory = new GroupedBarFactory();
            break;
        case TEMPLATE.LINE:
            charts = charts.map(chart => {
                chart.graph_colors = ['blue', 'red', 'blue', 'red', 'blue', 'red']
                chart.label = comments
                return chart
            })
            factory = new LargeDataLineFactory();
            break;
        case TEMPLATE.LINE_DENSE:
            break;
    }
    return {charts, factory}
}