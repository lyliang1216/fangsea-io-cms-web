import request from '@/utils/request'

export function getUsers (data) {
    return request({
        url: '/cms/user/query',
        method: 'post',
        data
    })
}

export function addUsers (data) {
    return request({
        url: '/cms/user/add',
        method: 'post',
        data
    })
}

/**
 * 用户授予角色
 * @param data 参数
 */
export function assignRoles (data) {
    return request({
        url: '/cms/user/role/auth',
        method: 'post',
        data
    })
}

/**
 * 查找当前用户创建的角色列表
 */
export function queryCuurentUser (data) {
    return request({
        url: '/cms/role/query/current/user',
        method: 'post',
        data
    })
}

/**
 *  根据用户ID查找角色列表
 */
export function getRolesById (data) {
    return request({
        url: '/cms/role/query/user',
        method: 'post',
        data
    })
}

/**
 *  更新用户
 */
export function updateUser (data) {
    return request({
        url: '/cms/user/update',
        method: 'post',
        data
    })
}

/**
 *  获取角色列表
 */
export function getRoles (data) {
    return request({
        url: '/cms/roles/list',
        method: 'post',
        data
    })
}

/**
 *  账户开启关闭
 */
export function updateUserState (data) {
    return request({
        url: '/cms/user/state/update',
        method: 'post',
        data
    })
}
