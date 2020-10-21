import request from '@/utils/request'

// 获取币种列表
export function selectCurrent (data) {
    return request({
        url: '/wallet/currency/config/query',
        method: 'post',
        data
    })
}

// 新增币种配置
export function addCurrent (data) {
    return request({
        url: '/wallet/currency/config/save',
        method: 'post',
        data
    })
}

// 编辑币种配置
export function updateCurrent (data) {
    return request({
        url: '/wallet/currency/config/update',
        method: 'post',
        data
    })
}

// 获取合约信息
export function selectContract (data) {
    return request({
        url: '/wallet/contract/info/get',
        method: 'post',
        data
    })
}

// 绑定合约信息
export function bindContract (data) {
    return request({
        url: '/wallet/contract/info/bind',
        method: 'post',
        data
    })
}

// 开启或关闭币种
export function changeUseContract (data) {
    return request({
        url: '/wallet/currency/state/update',
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
