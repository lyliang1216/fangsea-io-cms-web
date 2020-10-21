<template>
    <div class="navbar" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
        <breadcrumb/>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <span>{{displayName}}</span>
                <!--        <img :src="avatar+'?imageView2/1/w/80/h/80'"-->
                <!--             class="user-avatar">-->
                <i class="el-icon-caret-bottom"/>
            </div>

            <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <router-link class="inlineBlock" to="/">
                    <el-dropdown-item>
                        首页
                    </el-dropdown-item>
                </router-link>
                <span @click="paramConfig">
                    <el-dropdown-item>参数配置
                    </el-dropdown-item>
                </span>
                <span @click="changepsd">
                    <el-dropdown-item>修改密码
                    </el-dropdown-item>
                </span>
                <span @click="logout">
                    <el-dropdown-item divided>退出登录
                    </el-dropdown-item>
                </span>
            </el-dropdown-menu>
        </el-dropdown>

        <el-dialog title="修改密码" @close="closeDialog" :visible.sync="dialogFormVisible" width="25%"
                   :close-on-click-modal="false">
            <el-form :model="psdform" status-icon :rules="psdformrules" ref="psdform" label-width="100px"
                     v-if="dialogFormVisible">
                <el-form-item label="旧密码:" prop="oldpsd">
                    <el-input class="psdinput" type="password" v-model="psdform.oldpsd"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="newpsd">
                    <el-input class="psdinput" type="password" v-model="psdform.newpsd"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="checkpsd">
                    <el-input class="psdinput" type="password" v-model="psdform.checkpsd"></el-input>
                </el-form-item>
                <div class="bottombtn">
                    <el-button size="small" @click="resetForm()">取消</el-button>
                    <el-button type="primary" size="small" @click="submitForm('psdform')">提交</el-button>
                </div>
            </el-form>
        </el-dialog>

        <el-dialog title="参数配置" @close="closeConfigDialog" :visible.sync="dialogConfigVisible" width="580px"
                   :close-on-click-modal="false">
            <el-form :model="paramsConfig" status-icon ref="paramsConfig" label-width="100px"
                     v-if="dialogConfigVisible">
                <el-form-item label="时间区域:" prop="timeZone">
                    <el-select v-model="paramsConfig.timeZone" filterable size="small" placeholder="请选择"
                               style="width: 340px; margin-right: 10px">
                        <el-option v-for="item in timeList"
                                   :key="item.id"
                                   :label="item.city === '新加坡' ? `系统默认(${item.gmt}) ${item.city} ${item.cityEn}` : `(${item.gmt}) ${item.city} ${item.cityEn}`"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button size="small" type="primary" @click="resetConfig">重 置</el-button>
                </el-form-item>
                <div class="bottombtn">
                    <el-button type="primary" size="small" @click="saveUserTime">保存</el-button>
                    <el-button size="small" @click="closeConfigDialog">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {changepassword, getZoneTimeList, getSetZoneTime, saveZoneTime} from '@/api/global/index'
    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import Cookie from 'js-cookie'
    import {mapGetters} from 'vuex'

    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'))
                } else {
                    if (this.psdform.checkpsd !== '') {
                        this.$refs.psdform.validateField('checkpsd')
                    }
                    callback()
                }
            }
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'))
                } else if (value !== this.psdform.newpsd) {
                    callback(new Error('两次输入新密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                // 修改密码弹框
                dialogFormVisible: false,
                // 参数配置弹框
                dialogConfigVisible: false,
                psdform: {
                    oldpsd: '',
                    newpsd: '',
                    checkpsd: ''
                },
                psdformrules: {
                    oldpsd: [
                        {required: true, message: '请填写旧密码', trigger: 'blur'}
                    ],
                    newpsd: [
                        {required: true, validator: validatePass, trigger: 'blur'}
                    ],
                    checkpsd: [
                        {required: true, validator: validatePass2, trigger: 'blur'}
                    ]
                },
                // 管理员名称
                displayName: '',
                // 参数配置
                paramsConfig: {
                    // 时区
                    timeZone: ''
                },
                // 保存时区值
                timeZone: '',
                // 时区列表
                timeList: [],
                // 开启遮罩
                loading: false
            }
        },
        created () {
            if (Cookie.get('displayName_cms')) {
                this.displayName = Cookie.get('displayName_cms')
            }
            this.loading = true
            this.getTimeList()
            this.getUserTime()
        },
        components: {
            Breadcrumb,
            Hamburger
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar'
            ])
        },
        methods: {
            /**
             * 折叠菜单
             */
            toggleSideBar () {
                this.$store.dispatch('ToggleSideBar')
            },
            /**
             * 退出登录
             */
            logout () {
                Cookie.set('initlogout', 'toindex')
                this.$store.dispatch('user/logout').then(() => {
                    // 为了重新实例化vue-router对象 避免bug
                    location.reload()
                })
            },
            /**
             * 打开修改密码弹框
             */
            changepsd () {
                this.dialogFormVisible = true
            },
            /**
             * 提交修改密码
             */
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                oldPassword: this.psdform.oldpsd,
                                password: this.psdform.newpsd
                            }
                        }
                        changepassword(params).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('密码修改成功')
                                this.closeDialog()
                            } else {
                                this.$message.error(res.msg)
                            }
                        }).catch(err => {
                            this.$message.error(err.msg)
                        })
                    } else {
                        return false
                    }
                })
            },
            /**
             * 重置修改密码表单
             */
            resetForm () {
                this.psdform.oldpsd = ''
                this.psdform.newpsd = ''
                this.psdform.checkpsd = ''
                this.dialogFormVisible = false
            },
            /**
             * 关闭修改密码
             */
            closeDialog () {
                this.resetForm()
                this.dialogFormVisible = false
            },
            /**
             * 关闭参数配置
             */
            closeConfigDialog () {
                this.dialogConfigVisible = false
                this.paramsConfig.timeZone = this.timeZone
            },
            /**
             * 打开参数配置
             */
            paramConfig () {
                this.dialogConfigVisible = true
                this.getUserTime(true)
            },
            /**
             * 重置参数配置
             */
            resetConfig () {
                this.paramsConfig.timeZone = 1
                this.timeZone = 1
            },
            /**
             * 获取时区列表
             */
            getTimeList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getZoneTimeList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.timeList = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 获取用户设置时区
             * @param open 是否主动打开，如果是就不弹登录
             */
            getUserTime (open) {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getSetZoneTime(params).then(res => {
                    this.loading = false
                    if (res.code.toString() === '0') {
                        if (res.data) {
                            this.paramsConfig.timeZone = res.data.id
                            Cookie.set('zoneTime', this.getZoneTimeHour(res.data.gmt))
                            Cookie.set('GMT', res.data.gmt)
                        } else {
                            this.paramsConfig.timeZone = 90
                            this.saveUserTime(90)
                        }
                        this.timeZone = this.paramsConfig.timeZone
                    } else {
                        this.$message.error('未获取到时区信息，请稍后再试')
                        if (open) {
                            this.closeConfigDialog()
                        } else {
                            setTimeout(() => {
                                this.logout()
                            }, 1500)
                        }
                    }
                }).catch(() => {
                    this.loading = false
                    this.$message.error('未获取到时区信息，请稍后再试')
                    if (open) {
                        this.closeConfigDialog()
                    } else {
                        setTimeout(() => {
                            this.logout()
                        }, 1500)
                    }
                })
            },
            /**
             * 根据GMT算对应小时
             * @param gmt 时区
             */
            getZoneTimeHour (gmt) {
                let hour = Number(gmt.substring(4, 6))
                let min = Number(gmt.substring(7, 9)) / 60
                return Number(gmt[3] + (hour + min))
            },
            /**
             * 保存用户设置时区
             * @param zone 默认时区
             */
            saveUserTime (zone) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: typeof zone === 'number' ? zone : this.paramsConfig.timeZone
                }
                saveZoneTime(params).then(res => {
                    if (res.code.toString() === '0') {
                        if (typeof zone !== 'number') {
                            this.$message.success('保存成功')
                        }
                        let gmt = this.buyIdGetTime(params.data)
                        this.timeZone = typeof zone === 'number' ? zone : this.paramsConfig.timeZone
                        Cookie.set('zoneTime', this.getZoneTimeHour(gmt))
                        Cookie.set('GMT', gmt)
                        setTimeout(() => {
                            location.reload()
                        }, 800)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 获取id指定时区
             * @param id 时区的id
             */
            buyIdGetTime (id) {
                for (let i in this.timeList) {
                    if (this.timeList[i].id === id) {
                        return this.timeList[i].gmt
                    }
                }
            }

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                line-height: 50px;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    font-size: 12px;
                }
            }
        }
        .bottombtn {
            padding-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            button + button {
                margin-left: 20px;
            }
        }
        .psdinput {
            width: 280px;
            max-width: 100%;
        }
    }

    .el-dropdown-menu {
    }
</style>
