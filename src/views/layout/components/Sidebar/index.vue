<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
            :default-active="$route.path"
            :collapse="isCollapse"
            :background-color="variables.menuBg"
            :text-color="variables.menuText"
            :active-text-color="variables.menuActiveText"
            :collapse-transition="false"
            :unique-opened="true"
            mode="vertical"
        >
            <sidebar-item
                v-for="route in routes"
                :key="route.path"
                :item="route"
                :base-path="route.path"/>
        </el-menu>
    </el-scrollbar>
</template>

<script>
    import {mapGetters} from 'vuex'
    import variables from '@/assets/css/variables.scss'
    import SidebarItem from './SidebarItem'
    import {getCurrentRoles} from '@/api/global/index'
    import store from '@/store'

    export default {
        components: {SidebarItem},
        computed: {
            ...mapGetters([
                'sidebar'
            ]),
            routes () {
                return this.convertroles(this.$router.options.routes)
                // return this.$router.options.routes
            },
            variables () {
                return variables
            },
            isCollapse () {
                return !this.sidebar.opened
            }
        },
        data () {
            return {
                // 过滤后的路由
                arr: []
            }
        },
        created () {
            if (!localStorage.getItem('rolesCode')) {
                // 获取用户权限
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getCurrentRoles(params).then(res => {
                    if (res.code.toString() === '0') {
                        localStorage.setItem('rolesCode', JSON.stringify(res.data))
                    } else if (res.code.toString() === '7003') {
                        this.$message.error('此账号无权限')
                        this.$router.push({path: '/404'})
                    } else {
                        store.dispatch('user/logout').then(() => {
                            // 验证失败，请重新登录
                            this.$router.push({ path: '/' })
                        })
                    }
                }).catch(() => {
                    store.dispatch('user/logout').then(() => {
                        // 验证失败，请重新登录
                        this.$router.push({ path: '/' })
                    })
                })
            }
        },
        methods: {
            /**
             *  过滤菜单权限
             */
            convertroles (route) {
                let roles = JSON.parse(localStorage.getItem('rolesCode'))
                let routes = JSON.parse(JSON.stringify(route))
                this.arr = JSON.parse(JSON.stringify(routes))
                let allCode = []
                for (let i in roles) {
                    let code = roles[i].code
                    allCode.push(code)
                }
                for (let i in routes) {
                    if (!routes[i].hidden) {
                        if (!allCode.includes(routes[i].meta.id)) {
                            this.delarr(routes[i].meta.id)
                            continue
                        }
                        if (routes[i].children) {
                            for (let j in routes[i].children) {
                                if (!routes[i].children[j].hidden) {
                                    if (!allCode.includes(routes[i].children[j].meta.id)) {
                                        this.delarr(routes[i].children[j].meta.id)
                                        continue
                                    }
                                    if (routes[i].children[j].children) {
                                        for (let q in routes[i].children[j].children) {
                                            if (!routes[i].children[j].children[q].hidden) {
                                                if (!allCode.includes(routes[i].children[j].children[q].meta.id)) {
                                                    this.delarr(routes[i].children[j].children[q].meta.id)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return this.arr
            },
            /**
             * 过滤路由
             * @param id 要删除的id
             */
            delarr (id) {
                let routes = this.arr
                for (let i in routes) {
                    if (!routes[i].hidden) {
                        if (routes[i].meta.id === id) {
                            routes.splice(i, 1)
                            break
                        }
                        if (routes[i].children) {
                            for (let j in routes[i].children) {
                                if (!routes[i].children[j].hidden) {
                                    if (routes[i].children[j].meta.id === id) {
                                        routes[i].children.splice(j, 1)
                                        break
                                    }
                                    if (routes[i].children[j].children) {
                                        for (let q in routes[i].children[j].children) {
                                            if (!routes[i].children[j].children[q].hidden) {
                                                if (routes[i].children[j].children[q].meta.id === id) {
                                                    routes[i].children[j].children.splice(q, 1)
                                                    break
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</script>
