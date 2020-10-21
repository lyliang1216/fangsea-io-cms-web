import request from '@/utils/request'

// 获取树结构数据
export function getTree (data) {
    return request({
        url: '/article/category/query',
        method: 'post',
        data
    })
}

// 获取信息发布
export function getArticle (data) {
    return request({
        url: '/article/cms/detail/find/id',
        method: 'post',
        data
    })
}

// 新增信息发布
export function saveArticle (data) {
    return request({
        url: '/article/cms/detail/save',
        method: 'post',
        data
    })
}

// 编辑信息发布
export function updateArticle (data) {
    return request({
        url: '/article/cms/detail/update',
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
