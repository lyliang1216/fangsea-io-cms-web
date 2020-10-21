import request from '@/utils/request'

// 获取树结构数据
export function getTree (data) {
    return request({
        url: '/article/category/query',
        method: 'post',
        data
    })
}

// 修改类别管理
export function saveTree (data) {
    return request({
        url: '/article/category/save',
        method: 'post',
        data
    })
}
