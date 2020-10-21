import { parseTime, getZoneTime, removeSpaces } from '@/utils/filters'

// 全局方法
const methods = {parseTime, getZoneTime, removeSpaces}
// 全局过滤器
const filters = {parseTime, getZoneTime}

export default {
    install (Vue) {
        Object.keys(methods).forEach(key => { Vue.prototype[key] = methods[key] })
        Object.keys(filters).forEach(key => { Vue.filter(key, filters[key]) })
    }
}
