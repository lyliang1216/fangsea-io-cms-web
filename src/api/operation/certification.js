import request from '@/utils/request'

// 获取审核列表
export function getkyclist (data) {
    return request({
        url: '/dc/user/kyc/query',
        method: 'post',
        data
    })
}

// 获取编辑用户kyc
export function getuserkyc (data) {
    return request({
        url: '/dc/user/kyc/query/unique',
        method: 'post',
        data
    })
}

// 修改审核状态
export function savekyc (data) {
    return request({
        url: '/user/kyc/grant',
        method: 'post',
        data
    })
}

// 删除审核内容
export function delkyc (data) {
    return request({
        url: '/user/kyc/delete',
        method: 'post',
        data
    })
}

// 获取用户个人信息
export function getuserinfo (data) {
    return request({
        url: '/user/info/id/query',
        method: 'post',
        data
    })
}

// 获取国籍列表
export function getCountry (data) {
    return request({
        url: '/cms/region/usable/country/query',
        method: 'post',
        data
    })
}
