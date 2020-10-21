import {parseTime} from '@/utils/filters'
import Cookie from 'js-cookie'

/**
 * 数字补零
 * @param str 传入数字字符串或数字
 * @return {string}
 */
export function padLeftZero (str) {
    if (typeof str !== 'string') {
        return ('00' + str.toString()).substr(str.toString().length)
    }
    return ('00' + str).substr(str.length)
}

/**
 * 合并两个对象，给出最后一个优先级
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge (target, source) {
    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty)
        } else {
            target[property] = sourceProperty
        }
    })
    return target
}

/**
 * 获取指定时区的日期
 * @param offset 时区偏差+东-西 如果获取指定时间的前后时间则加上或减去对应小时
 * @param timestamp 获取指定时间戳 传入10位
 */
export function getZoneDate (timestamp, offset = parseInt(Cookie.get('zoneTime'))) {
    // 获取本地时区与格林尼治时区偏差（小时）
    let localOffset = new Date().getTimezoneOffset() / 60
    // 获取本地时区与指定时区的偏差（小时）
    let count = offset + localOffset
    // 获取本地时区需要补差的时间戳（毫秒）
    let times = count * 60 * 60 * 1000
    // 获取指定时区的时间戳在本地时区对应的时间对象
    let localtime = new Date(timestamp * 1000 + times)
    return parseTime(localtime.toDateString() + ' ' + localtime.getHours() + ':' + localtime.getMinutes() + ':' + localtime.getSeconds())
}

/**
 * 验证正整数
 */
export function amount (value) {
    return /^\d+$|^\d+[.]?\d+$/.test(value)
}
