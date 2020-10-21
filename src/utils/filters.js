import Cookie from 'js-cookie'

/**
 * 解析时间为字符串
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (time, cFormat) {
    if (time === '' || time === null || time === undefined || time === [] || time === {}) {
        return ''
    }
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return timeStr
}

/**
 * 限制输入数字位数
 * @param value 输入数据
 * @param intnum 整数位数
 * @param floatnum 小数位数(为零则只能输入正整数)
 */
export function inputlimit (value, intnum, floatnum) {
    value = value.toString()
    if (floatnum === 0) {
        value = value.replace(/[^\d]/g, '')
        if (value.length > intnum) {
            return value.substring(0, intnum)
        }
    } else {
        value = value.replace(/[^\d.]/g, '')
        // 没有小数点，判断整数部分
        if (value.indexOf('.') === -1) {
            if (value.length > intnum) {
                return value.substring(0, intnum)
            }
            // 有小数点
        } else {
            // 判断小数部分
            if (value.split('.')[1].length > floatnum) {
                return value.substring(0, value.indexOf('.') + floatnum + 1)
            }
            // 判断整数部分
            if (value.split('.')[0].length > intnum) {
                return value.split('.')[0].substring(0, intnum) + '.' + value.split('.')[1]
            }
        }
    }
    return value
}

/**
 * 科学计数法转数字
 * @param num 数据源
 */
export function getFullNum (num) {
    // 处理非数字
    if (isNaN(num)) {
        return num
    }
    // 处理不需要转换的数字
    let str = '' + num
    if (!/e/i.test(str)) {
        return num
    }
    return (num).toFixed(8).replace(/\.?0+$/, '')
}

/**
 * 去除字符串头尾空格
 * @param data 数据源
 */
export function removeSpaces (data) {
    if (data === null || data === undefined) {
        return data
    }
    if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object') {
                data[key] = removeSpaces(data[key])
            } else if (typeof data[key] === 'string') {
                data[key] = data[key].replace(/(^\s*)|(\s*$)/g, '')
            }
        })
        return data
    } else if (typeof data === 'string') {
        return data.replace(/(^\s*)|(\s*$)/g, '')
    } else {
        return data
    }
}

/**
 * 判断两个数组是否相等
 * @param arr1 数组一
 * @package arr2 数组二
 */
export function arrIsSame (arr1, arr2) {
    function compare (prop) {
        return function (obj1, obj2) {
            let val1 = obj1[prop]
            let val2 = obj2[prop]
            if (val1 < val2) {
                return -1
            } else if (val1 > val2) {
                return 1
            } else {
                return 0
            }
        }
    }

    let array1 = arr1.sort(compare('permissionId'))
    let array2 = arr2.sort(compare('permissionId'))
    return JSON.stringify(array1) === JSON.stringify(array2)
}

/**
 * 获取指定时区的时间
 * @param timestamp 获取指定时间戳 传入10位 不传就是获取当前时间
 * @param offset 时区偏差+东-西 如果获取指定时间的前后时间则加上或减去对应小时 不传入参数则是取当前系统配置时区
 */
export function getZoneTime (timestamp, offset) {
    offset = offset === undefined ? Cookie.get('zoneTime') : offset
    // 取本地时间
    let localtime = timestamp ? new Date(timestamp * 1000) : new Date()
    // 取本地毫秒数
    let localmesc = localtime.getTime()
    // 取本地时区与格林尼治所在时区的偏差毫秒数 getTimezoneOffset分钟
    let localOffset = localtime.getTimezoneOffset() * 60000
    // 反推得到格林尼治时间
    let utc = localOffset + localmesc
    // 得到指定时区时间
    let calctime = utc + (3600000 * offset)
    let nd = new Date(calctime)
    return parseTime(nd.toDateString() + ' ' + nd.getHours() + ':' + nd.getMinutes() + ':' + nd.getSeconds())
}

/**
 * 获取指定时间在指定时区的时间戳
 * @param date 日期格式
 * @param offset 指定时区
 */
export function getZoneTimeTamp (date, offset) {
    offset = offset === undefined ? Number(Cookie.get('zoneTime')) : offset
    // 获取当前时区下的时间戳
    let nowTamp = new Date(date).getTime()
    // 获取时区偏差分钟数，东为负
    let mins = new Date().getTimezoneOffset() / 60
    // 获取偏差的毫秒
    let tamp = nowTamp + (-mins - offset) * 3600000
    return parseInt(tamp / 1000)
}

/**
 * 数字转为金额格式 三位','
 * @param val 数字
 */
export function getMoneyNum (val) {
    return parseFloat(getCurLeng(val, 2)).toLocaleString()
}

/**
 * 生成唯一ID
 */
export function UUID () {
    return Number(Math.random().toString().substr(3, Math.floor(Math.random() * 10 + 1)) + Date.now()).toString(36)
}

/**
 * 空数字转中划线
 * @param number 数字值
 */
export function nullToLine (number) {
    if (typeof number === 'number') {
        number = number.toString()
    }
    let bool = number && number.length > 0
    return bool ? number : '-'
}

/**
 * 分钟/秒
 */
export function toMMSS (val) {
    let mm
    let ss
    if (val < 60) {
        mm = 0
        ss = val
    } else {
        mm = parseInt(val / 60)
        ss = val % 60
    }
    return mm + ' 分钟 ' + ss + ' 秒'
}

/**
 *  保留几位小数
 *  @param val 要转换的数据
 *  @param digits 保留几位
 *  @param saveUp 是否向上补位
 */
export function getfloat (val, digits, saveUp) {
    if (!digits) {
        digits = 2
    }
    if (!saveUp) {
        if (val.toString().indexOf('.') !== -1) {
            return Math.floor(Number(val) * Math.pow(10, digits)) / Math.pow(10, digits)
        } else {
            return val
        }
    } else {
        if ((val * Math.pow(10, digits)).toString().indexOf('.') !== -1) {
            val = (val * Math.pow(10, digits) + 1) / Math.pow(10, digits)
        } else {
            val = (val * Math.pow(10, digits)) / Math.pow(10, digits)
        }
        if (val.toString().indexOf('.') !== -1) {
            val = val.toString().substring(0, val.toString().indexOf('.') + digits + 1)
        }
        let index = val.toString().indexOf('.') + 1
        let n = val.toString().length - index
        if (n < digits && index !== 0) {
            let s = digits - n
            for (let i = 0; i < s; i++) {
                val = val.toString() + '0'
            }
        }
        return val
    }
}

/**
 *  保留几位小数，直接截取
 *  @param val 要转换的数据
 *  @param digits 保留几位
 */
export function getCurLeng (val, digits) {
    val += ''
    if (!digits) {
        digits = 2
    }
    if (val.includes('.')) {
        return val.substring(0, val.indexOf('.') + digits + 1)
    } else {
        return val
    }
}

/**
 * 上传文件，移除文件时取id
 * @param data 文件  正常移除有file.fileId，上传前被阻止file.raw.uid，上传中被移除file.uid，上传失败file就是uid
 */
export function getFileId (data) {
    let id = ''
    if (data.fileId) {
        id = data.fileId
    } else if (data.raw) {
        id = data.raw.uid
    } else if (typeof data === 'number') {
        id = data
    }
    return id
}

/**
 * pto返回组装数据与上传一致
 * @param data 文件列表
 */
export function resetFileList (data) {
    return data.map(item => {
        if (item.type) {
            return {fileId: item.relationId, name: item.name, type: item.type, filePath: item.fileUrl}
        } else {
            return {fileId: item.relationId, name: item.name, type: item.type, filePath: item.largeUrl}
        }
    })
}

/**
 * pto上传组装数据
 * @param data 文件列表
 */
export function upSetFileList (data) {
    return data.map(item => {
        return {relationId: item.fileId, name: item.name, type: item.type}
    })
}
