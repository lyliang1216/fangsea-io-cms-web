import request from '@/utils/request'

// 获取平台钱包数据
export function getPlatformWallet (data) {
    return request({
        url: '/wallet/fixed/address/get',
        method: 'post',
        data
    })
}

// 获取项目钱包数据
export function getprojectWallet (data) {
    return request({
        url: '/pto/wallet/address/list',
        method: 'post',
        data
    })
}

// 获取项目编号
export function getprojectNumber (data) {
    return request({
        url: '/pto/number/list',
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

// 获取PT项目
export function getProject (data) {
    return request({
        url: '/pto/all/state/list',
        method: 'post',
        data
    })
}
