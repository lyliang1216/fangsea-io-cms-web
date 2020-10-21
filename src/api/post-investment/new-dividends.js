import request from '@/utils/request'

// 获取损益范围
export function getRangeData (data) {
    return request({
        url: '/cms/profit/base/edit/get',
        method: 'post',
        data
    })
}
// 保存损益范围（新增）
export function saveRangeData (data) {
    return request({
        url: '/cms/profit/base/save',
        method: 'post',
        data
    })
}

// 保存损益范围（编辑）
export function updateRangeData (data) {
    return request({
        url: '/cms/profit/base/update',
        method: 'post',
        data
    })
}

// 获取已完成项目数据
export function getComplateList (data) {
    return request({
        url: '/pto/cms/complete/list',
        method: 'post',
        data
    })
}

// 获取损益分红类别列表
export function getProfitLossType (data) {
    return request({
        url: `/cms/profit/category/query`,
        method: 'post',
        data
    })
}

// 获取数据采集
export function getDataCollection (data) {
    return request({
        url: '/cms/profit/data/edit/get',
        method: 'post',
        data
    })
}

// 获取可用的日期
export function accountSnapshotTimeQuery (data) {
    return request({
        url: '/wallet/account/snapshot/time/query',
        method: 'post',
        data
    })
}

// 获取汇率
export function getProfitRate (data) {
    return request({
        url: '/cms/profit/find/rate',
        method: 'post',
        data
    })
}

// 保存数据采集
export function saveDataCollection (data) {
    return request({
        url: '/cms/profit/data/save',
        method: 'post',
        data
    })
}

// 获取单份PT分红列表
export function getSinglePT (data) {
    return request({
        url: '/cms/profit/ticker/present/list',
        method: 'post',
        data
    })
}

// 获取链上快照列表
export function getChainSnapshot (data) {
    return request({
        url: '/cms/profit/chain/snapshot/list',
        method: 'post',
        data
    })
}

// 获取PTEX损益列表
export function getPTEXProfitLoss (data) {
    return request({
        url: '/cms/profit/ptex/list',
        method: 'post',
        data
    })
}

// 获取PTOHome损益列表
export function getPTOProfitLoss (data) {
    return request({
        url: '/cms/profit/ptohome/list',
        method: 'post',
        data
    })
}

// 获取PTEX快照列表
export function getPTEXSnapshot (data) {
    return request({
        url: '/cms/profit/ptex/snapshot/list',
        method: 'post',
        data
    })
}

// 获取PTOHome快照列表
export function getPTOSnapshot (data) {
    return request({
        url: '/cms/profit/ptohome/snapshot/list',
        method: 'post',
        data
    })
}

// 获取分红结算列表
export function getDividendSettle (data) {
    return request({
        url: '/cms/profit/present/clearing',
        method: 'post',
        data
    })
}

// 获取错误信息列表
export function getErrorMessage (data) {
    return request({
        url: '/cms/profit/error/list',
        method: 'post',
        data
    })
}

// 获取结算按钮
export function settlementReq (data) {
    return request({
        url: '/cms/profit/bonus/clearing',
        method: 'post',
        data
    })
}

// 获取驳回按钮
export function turnDownReq (data) {
    return request({
        url: '/cms/profit/examine/reject',
        method: 'post',
        data
    })
}

// 第三步提交财务审核
export function submitFinanceSettle (data) {
    return request({
        url: '/cms/profit/examine/submit',
        method: 'post',
        data
    })
}

// 查询详情
export function searchDetails (data) {
    return request({
        url: '/cms/profit/details/query',
        method: 'post',
        data
    })
}

// 文件上传
export function imageUpload (data) {
    return request({
        url: '/cms/profit/snapshot/template/up',
        method: 'post',
        headers: {'content-type': 'multipart/form-data'},
        data
    })
}
