import request from '@/utils/request'

// 获取地区数据api
export function findRegion (data) {
    return request({
        url: '/cms/region/query',
        method: 'post',
        data
    })
}

// 更新地区数据api
export function createRegion (data) {
    return request({
        url: '/cms/region/update',
        method: 'post',
        data
    })
}

// 删除地区数据api
export function deleteRegion (data) {
    return request({
        url: '/cms/region/delete',
        method: 'post',
        data
    })
}
