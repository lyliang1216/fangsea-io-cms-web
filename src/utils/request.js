import axios from 'axios'
import store from '../store'
import Cookie from 'js-cookie'
import { Message } from 'element-ui'
import { getrefreshtoken } from '@/api/global/index'
import router from '../router'
import Vue from 'vue'

// 创建axios实例
let service = axios.create({
    // api 的 base_url
    baseURL: process.env.BASE_API,
    // 请求超时时间
    timeout: 300000
})

if (Cookie.get('token_cms')) {
    // 让每个请求携带 token 请根据实际情况自行修改
    service.defaults.headers['Authorization'] = 'bearer' + ' ' + Cookie.get('token_cms')
}

// request拦截器
service.interceptors.request.use(
    config => {
        let url = window.location.href
        // 登录，pto发行保存暂存时不开启
        if ((!url.includes('/login') || (url.includes('/newrelease') && !config.url.includes('/save'))) && !config.url.includes('/file/upload')) {
            // 开启Loading
            store.dispatch('UpdateLoading', true)
        }
        // 判断是否涉及多语言配置
        if (config.data.locale) {
            config.url = config.url + '?locale=' + config.data.locale
            delete config.data.locale
        }
        if (Cookie.get('GMT')) {
            if (!config.data.timeZone && Object.prototype.toString.call(config.data) === '[object FormData]') {
                config.data.append('timeZone', Cookie.get('GMT'))
            } else {
                config.data = {
                    timeZone: Cookie.get('GMT'),
                    ...config.data
                }
            }
        }
        config.data = Vue.prototype.removeSpaces(config.data)
        return config
    }
)

// 全局拦截响应
service.interceptors.response.use(
    response => {
        // 关闭Loading
        store.dispatch('UpdateLoading', false)
        // 判断请求token是否过期
        if (response.data.code.toString() === '7000') {
            return new Promise(resolve => {
                let formdata = new FormData()
                formdata.append('grant_type', 'refresh_token')
                formdata.append('client', 'cms')
                formdata.append('refresh_token', Cookie.get('refresh_token_cms'))
                getrefreshtoken(formdata, Cookie.get('authorization_cms')).then(res => {
                    // 成功刷新 access_token
                    if (res.code.toString() === '0') {
                        // 用于登录权限拦截
                        Cookie.set('token_cms', res.access_token)
                        Cookie.set('refresh_token_cms', res.refresh_token, {expires: res.refresh_token_expires_in / 60 / 60 / 24})
                        // 用于后端校验登录状态
                        service.defaults.headers['Authorization'] = 'bearer' + ' ' + res.access_token
                        // 请求参数
                        let params = ''
                        if (Object.prototype.toString.call(params) !== '[object FormData]') {
                            params = JSON.parse(response.config.data)
                        } else {
                            params = response.config.data
                        }
                        // 发送用户操作请求
                        let url = response.config.url.slice(service.defaults.baseURL.length)
                        let data = async function () {
                            let data = await service.post(url, params)
                            resolve(data)
                        }
                        data()
                    } else {
                        // 刷新失败，退出登录
                        store.dispatch('user/logout').then(() => {
                            // 为了重新实例化vue-router对象 避免bug
                            location.reload()
                        })
                        localStorage.removeItem('roles')
                        window.location.href = '/login'
                    }
                })
            })
        } else if (response.data.code.toString() === '7001') {
            // 刷新失败，退出登录
            store.dispatch('user/logout').then(() => {
                // 为了重新实例化vue-router对象 避免bug
                location.reload()
            })
            localStorage.removeItem('roles')
            window.location.href = '/login'
        } else if (response.data.code.toString() === '7003') {
            // 无权限，弹首页
            router.push({path: '/dashboard'})
            store.dispatch('user/updateReRender')
            return response.data
        } else {
            return response.data
        }
    },
    error => {
        // 关闭Loading
        store.dispatch('UpdateLoading', false)
        if (error.message.includes('timeout')) {
            Message.error('请求超时')
        }
        if (error.message.includes('Network')) {
            Message.error('请求错误')
        }
        if (error.message.includes('302')) {
            Message.error('重定向失败')
        }
        if (error.message.includes('404')) {
            Message.error('请求地址错误')
        }
        if (error.message.includes('403')) {
            Message.error('请求跨域')
        }
        if (error.message.includes('500')) {
            Message.error('服务端错误')
        }
        if (error.message.includes('502')) {
            Message.error('服务端错误')
        }
        return Promise.reject(error)
    }
)

export default service
