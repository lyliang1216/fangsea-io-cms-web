import {arrIsSame} from '@/utils/filters'
import Router from '@/router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Cookie from 'js-cookie'
import store from '@/store'
// NProgress configuration
NProgress.configure({showSpinner: false})

// 不重定向白名单
const whiteList = ['/login', '/auth-redirect']

const whiteNext = ['/preview', '/404', '/dashboard', '/']

Router.beforeEach(async (to, from, next) => {
    // 进度条开始
    NProgress.start()
    if (Cookie.get('refresh_token_cms')) {
        if (to.path === '/login') {
            next({path: '/'})
            // 如果当前页面是仪表板，则在每次挂接后都不会触发，请手动处理它
        } else {
            let oldRole = localStorage.getItem('rolesCode')
            store.dispatch('user/getInfoPermission').then(res => {
                if (res.code.toString() === '0') {
                    if (!arrIsSame(JSON.parse(oldRole), res.data)) {
                        store.dispatch('user/updateReRender')
                    }
                }
                // 判断非白名单的无权限地址
                if (!whiteNext.includes(to.path) && !localStorage.getItem('rolesCode').includes(to.path)) {
                    next(`/dashboard`)
                } else {
                    next()
                }
            }).catch(() => {
                if (!whiteNext.includes(to.path) && !localStorage.getItem('rolesCode').includes(to.path)) {
                    next(`/dashboard`)
                } else {
                    next()
                }
            })
        }
    } else {
        if (!whiteList.includes(to.path)) {
            // 是否为主动退出
            let initlogout = Cookie.get('initlogout')
            if (initlogout === 'toindex') {
                Cookie.remove('initlogout')
                next(`/login`)
            } else {
                // 否则全部重定向到登录页
                next(`/login?redirect=${to.path}`)
            }
        } else {
            next()
        }
    }
})

Router.afterEach(() => {
    // 结束导航条
    NProgress.done()
})
