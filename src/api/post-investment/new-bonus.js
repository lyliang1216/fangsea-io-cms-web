import request from '@/utils/request'

// 新增赠币
export function newCoin (data) {
    return request({
        url: '/cms/wallet/present/transfer',
        method: 'post',
        data
    })
}

// 导入新增赠币
export function importNewCoin (data) {
    return request({
        url: '/cms/wallet/present/import/excel',
        method: 'post',
        data
    })
}

// 获取项目列表
export function getProjectList (data) {
    return request({
        url: '/pto/complete/list',
        method: 'post',
        data
    })
}

// 获取钱包币种
export function getWalletCurrency (data) {
    return request({
        url: '/wallet/currency/query',
        method: 'post',
        data
    })
}
