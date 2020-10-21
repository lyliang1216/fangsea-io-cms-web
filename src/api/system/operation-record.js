import request from '@/utils/request'

/**
 *  获取操作记录列表数据
 */
export function operationList (data) {
    return request({
        url: '/log/list',
        method: 'post',
        data
    })
}

/**
 *  获取业务模板列表
 */
export function businessModel (data) {
    return request({
        url: '/log/business/model/get',
        method: 'post',
        data
    })
}
/**
 *  获取操作详情
 */
export function getOperationDetail (data) {
    return request({
        url: '/log/detail/by_user/get',
        method: 'post',
        data
    })
}
/**
 *  获取操作记录
 */
export function getOperationRecord (data) {
    return request({
        url: '/log/detail/by_business/get',
        method: 'post',
        data
    })
}

/**
 * 获取userId列表
 */
export function getUsers (data) {
    return request({
        url: '/cms/user/query',
        method: 'post',
        data
    })
}
