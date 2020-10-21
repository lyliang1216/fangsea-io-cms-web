import request from '@/utils/request'

/**
 *  登录
 */
export function login (data) {
    return request({
        url: '/authentication/form',
        method: 'post',
        data
    })
}

/**
 *  刷新token
 */
export function getrefreshtoken (data, authorizationCms) {
    return request({
        url: '/oauth/refreshToken',
        method: 'post',
        headers: {'Authorization': authorizationCms},
        data
    })
}

/**
 *  修改密码
 */
export function changepassword (data) {
    return request({
        url: '/cms/user/change/password',
        method: 'post',
        data
    })
}

/**
 *  获取时区列表
 */
export function getZoneTimeList (data) {
    return request({
        url: '/cms/timezone/list',
        method: 'post',
        data
    })
}

/**
 *  获取用户设置时区
 */
export function getSetZoneTime (data) {
    return request({
        url: '/cms/timezone/by/userid',
        method: 'post',
        data
    })
}

/**
 *  保存用户设置时区
 */
export function saveZoneTime (data) {
    return request({
        url: '/cms/timezone/save',
        method: 'post',
        data
    })
}

/**
 * 获取当前角色的列表
 */
export function getCurrentRoles (data) {
    return request({
        url: '/cms/permission/role/list',
        method: 'post',
        data
    })
}
