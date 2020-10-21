import request from '@/utils/request'

// 获取赠币列表
export function getCoinList (data) {
    return request({
        url: '/cms/present/list/query',
        method: 'post',
        data
    })
}
// 获取公司账户数据
export function getCompanyAccount (data) {
    return request({
        url: '/wallet/account/company/query',
        method: 'post',
        data
    })
}
