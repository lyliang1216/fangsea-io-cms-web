import request from '@/utils/request'

// 获取用户列表api
export function getMemberData (data) {
    return request({
        url: '/user/list',
        method: 'post',
        data
    })
}

// 获取单用户kyc信息
export function getMemberKyc (data) {
    return request({
        url: '/dc/user/kyc/query/foreign',
        method: 'post',
        data
    })
}

// 获取单用户账户数据
export function getMemberAccount (data) {
    return request({
        url: '/wallet/account/user/info/query',
        method: 'post',
        data
    })
}
// 获取单用户钱包数据
export function getMemberWallet (data) {
    return request({
        url: '/wallet/account/chain/balance/query',
        method: 'post',
        data
    })
}

// 获取单用户状态kyc认证信息
export function getMemberKycState (data) {
    return request({
        url: '/user/kyc/state/query',
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
