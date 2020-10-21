import request from '@/utils/request'

// 获取提醒设置
export function getset (data) {
    return request({
        url: '/cms/config/query',
        method: 'post',
        data
    })
}

// 保存提醒设置
export function saveset (data) {
    return request({
        url: '/cms/config/update',
        method: 'post',
        data
    })
}

// 获取区号
export function getAreacode (data) {
    return request({
        url: '/cms/region/usable/country/query',
        method: 'post',
        data
    })
}
