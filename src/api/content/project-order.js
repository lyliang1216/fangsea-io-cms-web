import request from '@/utils/request'

// 获取项目列表
export function getProList (data) {
    return request({
        url: '/pto/base/sort/list',
        method: 'post',
        data
    })
}

// 修改项目顺序
export function saveProOrder (data) {
    return request({
        url: '/pto/base/sort/update',
        method: 'post',
        data
    })
}

// 重置项目顺序
export function resetProOrder (data) {
    return request({
        url: '/pto/base/sort/reset',
        method: 'post',
        data
    })
}
