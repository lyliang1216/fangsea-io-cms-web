import request from '@/utils/request'

// 触发待发布文章状态更新
export function updateStatus (data) {
    return request({
        url: '/article/cms/detail/change/status',
        method: 'post',
        data
    })
}
// 获取列表
export function getHistoricalDisclosureList (data) {
    return request({
        url: '/dc/article/cms/list',
        method: 'post',
        data
    })
}
// 撤回披露消息
export function withdrawHistoricalDisclosure (data) {
    return request({
        url: '/article/cms/detail/status',
        method: 'post',
        data
    })
}
// 删除披露消息
export function deleteHistoricalDisclosure (data) {
    return request({
        url: '/article/cms/detail/del',
        method: 'post',
        data
    })
}
// 删除披露消息
export function saveDisclosureProject (data) {
    return request({
        url: '/article/cms/project/update',
        method: 'post',
        data
    })
}

// 获取树结构数据
export function getTree (data) {
    return request({
        url: '/article/category/query',
        method: 'post',
        data
    })
}

// 获取PT项目
export function getProject (data) {
    return request({
        url: '/pto/all/state/list',
        method: 'post',
        data
    })
}
