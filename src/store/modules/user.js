import {login, getCurrentRoles} from '@/api/global/index'
import {UUID} from '@/utils/filters'
import Cookie from 'js-cookie'
import axios from 'axios'

const state = {
    token: Cookie.get('token_cms'),
    authorization: Cookie.get('authorization_cms'),
    refresh_token: Cookie.get('refresh_token_cms'),
    roles: [],
    reRender: 0
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_RERENDER: (state) => {
        state.reRender++
    }
}
const actions = {
    // 用户登录（ 该方法名字在映射的时候会被改写 user/login => login ）
    login ({commit}, userInfo) {
        const {username, password} = userInfo
        return new Promise((resolve, reject) => {
            let formdata = new FormData()
            formdata.append('traceId', UUID())
            formdata.append('username', username.trim())
            formdata.append('password', password)
            formdata.append('CLIENT_ID', 'cms')
            axios.defaults.headers['Authorization'] = ''
            login(formdata).then(res => {
                if (res.code.toString() === '0') {
                    // 用于登录权限拦截
                    Cookie.set('token_cms', res.tokenData.access_token)
                    Cookie.set('displayName_cms', res.tokenData.displayName)
                    Cookie.set('refresh_token_cms', res.tokenData.refresh_token, {expires: res.tokenData.refresh_token_validity_seconds / 60 / 60 / 24})
                    // 刷新token时放head
                    Cookie.set('authorization_cms', res.tokenData.authorization)
                    // 用于后端校验登录状态
                    axios.defaults.headers['Authorization'] = 'bearer' + ' ' + res.tokenData.access_token
                    resolve(res)
                } else if (res.code.toString() === '1004') {
                    reject(res)
                } else {
                    reject(res)
                }
            })
                .catch(err => {
                    reject(err)
                })
        })
    },

    // 获取用户权限
    getInfoPermission ({commit, state}) {
        return new Promise((resolve, reject) => {
            let params = {
                traceId: Math.random().toString(36).substr(2)
            }
            getCurrentRoles(params).then(res => {
                if (res.code.toString() === '0') {
                    localStorage.setItem('rolesCode', JSON.stringify(res.data))
                    resolve(res)
                } else {
                    resolve(res)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 退出登录
    logout ({commit, state}) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            Cookie.remove('token_cms')
            Cookie.remove('authorization_cms')
            Cookie.remove('refresh_token_cms')
            localStorage.removeItem('rolesCode')
            axios.defaults.headers['Authorization'] = ''
            Cookie.remove('displayName_cms')
            Cookie.remove('zoneTime')
            Cookie.remove('GMT')
            resolve()
        })
    },
    // 重新渲染组件
    updateReRender ({commit}) {
        commit('SET_RERENDER')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
