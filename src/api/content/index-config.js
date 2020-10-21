import request from '@/utils/request'

/**
 * 查询一二项目列表
 */
export function getIndexList (data) {
    return request({
        url: '/pto/index/list',
        method: 'post',
        data
    })
}

/**
 * 查询可选项目列表
 */
export function getProList (data) {
    return request({
        url: '/pto/index/list/projectId/query',
        method: 'post',
        data
    })
}

/**
 * 提交修改项目
 */
export function savePro (data) {
    return request({
        url: '/pto/index/list/order/update',
        method: 'post',
        data
    })
}
