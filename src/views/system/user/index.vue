<template>
    <div class="app-container">
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="姓名/登录名" prop="fromAccountType">
                <el-input v-model="filter.nameOrLoginName" placeholder="请输入姓名/登录名并选择" size="small"
                          class="profitloss-time"/>
            </el-form-item>
            <el-form-item label="状态" prop="toAccountType">
                <el-select v-model="filter.state" clearable filterable size="small" placeholder="请选择">
                    <el-option
                        v-for="item in states"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="bizType">
                <el-select class="multiple-select" v-model="filter.roleIds" clearable multiple filterable size="small"
                           placeholder="请输入角色名并选择">
                    <el-option
                        v-for="item in selectRoleList"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getListData" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="handleAddRole" icon="el-icon-plus" v-auth="{id: 10600010001}">
            新建用户
        </el-button>
        <!-- 表单数据 -->
        <el-table :data="userList"
                  style="width: 100%;margin-top:30px;"
                  stripe>
            <el-table-column align="center" label="编号" width="150">
                <template slot-scope="scope">
                    {{ scope.row.userId }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名">
                <template slot-scope="scope">
                    {{ scope.row.userName }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="登录名">
                <template slot-scope="scope">
                    {{ scope.row.loginName }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="邮箱">
                <template slot-scope="scope">
                    {{ scope.row.email }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="电话">
                <template slot-scope="scope">
                    {{ scope.row.phone }}
                </template>
            </el-table-column>
            <el-table-column
                prop="state"
                width="120px"
                label="状态">
                <template slot-scope="props">
                    <span class="state-dot brown" v-if="props.row.state === 0"></span>
                    <span class="state-dot green" v-else-if="props.row.state === 1"></span>
                    {{ props.row.state ? '开启' : '禁用' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="280">
                <template slot-scope="scope">
                    <el-button
                        v-if="!(scope.row.loginName === 'admin')"
                        v-auth="{id: 10600010002}"
                        type="primary"
                        size="small"
                        @click="operationFun(scope)"> 编辑
                    </el-button>
                    <el-button
                        v-auth="{id: 10600010003}"
                        v-if="!(scope.row.loginName === 'admin')"
                        size="small"
                        @click="updateUserState(scope.row)">
                        <template v-if="scope.row.state === 0">
                            启用
                        </template>
                        <template v-else>
                            禁用
                        </template>
                    </el-button>
                    <el-button
                        size="small"
                        v-auth="{id: 10600010004}"
                        v-if="!(scope.row.loginName === 'admin')"
                        @click="showOperationDetail(scope)"> 操作记录
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="getUsres"/>
        <!-- 弹出层 -->
        <el-dialog :visible.sync="dialog.dialogVisible"
                   @close="closedialog"
                   :close-on-click-modal="false"
                   :title="dialog.dialogType === 'edit' ? '编辑管理员' : '新增管理员'">
            <el-form :model="users"
                     ref="users"
                     :rules="rules"
                     label-width="120px"
                     label-position="right">
                <el-form-item label="userId" prop="userId" v-show="dialog.dialogType === 'edit'">
                    <el-input
                        disabled
                        style="width: 60%"
                        v-model="users.userId"
                        placeholder=""/>
                </el-form-item>
                <el-form-item label="管理员名" prop="userName">
                    <el-input
                        style="width: 60%"
                        v-model="users.userName"
                        placeholder="请输入管理员名..."/>
                </el-form-item>
                <el-form-item label="登录名" prop="loginName">
                    <el-input
                        :disabled="dialog.dialogType === 'edit'"
                        style="width: 60%"
                        v-model="users.loginName"
                        placeholder="请输入登录名..."/>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="dialog.dialogType !== 'edit'">
                    <el-input
                        type="password"
                        style="width: 60%"
                        v-model="users.password"
                        placeholder="请输入密码..."/>
                </el-form-item>
                <el-form-item label="密码" prop="editPassword" v-else>
                    <el-input
                        type="password"
                        style="width: 60%"
                        v-model="users.password"
                        placeholder="不输入则是不修改密码"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input
                        style="width: 60%"
                        v-model="users.email"
                        placeholder="请输入邮箱..."/>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input
                        style="width: 60%"
                        v-model="users.phone"
                        placeholder="请输入电话..."/>
                </el-form-item>
                <!-- 穿梭框 -->
                <el-form-item label="角色">
                    <el-transfer
                        style="text-align: left; display: inline-block"
                        v-model="value"
                        filterable
                        :titles="['全部角色', '已分配角色']"
                        :button-texts="['到左边', '到右边']"
                        :format="{
                                    noChecked: '${total}',
                                    hasChecked: '${checked}/${total}'
                                  }"
                        @change="handleChange"
                        :data="roleList">
                        <span slot-scope="{ option }">{{ option.key  }} - {{ option.label }}</span>
                    </el-transfer>
                </el-form-item>
                <el-form-item label="状态">
                    <el-checkbox v-model="users.state"/>
                </el-form-item>
            </el-form>
            <div style="text-align:right; display: flex;justify-content: center">
                <el-button type="danger" size="small" @click="dialog.dialogVisible = false"> 取消</el-button>
                <el-button v-if="dialog.dialogType !== 'edit'" size="small" type="primary" @click="confirmAdd"> 确认
                </el-button>
                <el-button v-else size="small" type="primary" @click="confirmEdit"> 确认
                </el-button>
            </div>
        </el-dialog>
        <!-- 操作记录弹窗-->
        <dialog-detail :isDetail="false" ref="OperationDetail"/>
    </div>
</template>

<script>
    import {
        getUsers,
        addUsers,
        queryCuurentUser,
        assignRoles,
        getRolesById,
        updateUser,
        getRoles,
        updateUserState
    } from '@/api/system/user'
    import DialogDetail from '@/components/OperationDetail'
    import Pagination from '@/components/Pagination'

    const defaultUser = {
        // 用户ID
        userId: '',
        // 管理员名
        userName: '',
        // 密码
        password: '',
        // 登录名
        loginName: '',
        // 邮箱
        email: '',
        // 电话
        phone: '',
        // 状态
        state: false
    }

    export default {
        data () {
            let validatePass = (rule, value, callback) => {
                if (this.users.password !== '' && this.users.password.length < 6) {
                    callback(new Error('至少6位，最多18位'))
                } else {
                    callback()
                }
            }
            return {
                // 筛选条件
                filter: {
                    nameOrLoginName: '',
                    state: '',
                    roleIds: []
                },
                // 筛选条件（查询）
                filterSearch: {
                    nameOrLoginName: '',
                    state: '',
                    roleIds: []
                },
                states: [{
                    name: '禁用',
                    type: 0
                }, {
                    name: '开启',
                    type: 1
                }],
                users: Object.assign({}, defaultUser),
                // 创建的每个用户的id
                userId: '',
                // 管理员信息
                userList: [],
                // 查询角色列表
                selectRoleList: [],
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                // 弹出层
                dialog: {
                    dialogVisible: false,
                    dialogType: 'new'
                },
                checkStrictly: false,
                value: [],
                roleList: [],
                // 当前页
                currentPage: 1,
                // 总条数
                total: 0,
                // 每页显示数量
                pageSize: 10,
                // 时间戳
                nowTime: '',
                // 角色分配的权限
                cifSauserList: '',
                // 菜单分配的权限
                menuPermissions: [],
                // 菜单分配的权限 keys
                menuPermissionsKey: [],
                // 权限数据
                permissionData: '',
                rules: {
                    password: [
                        {min: 6, max: 18, message: '至少6位，最多18位', trigger: 'blur'},
                        {required: true, message: '请填写密码', trigger: 'blur'}
                    ],
                    editPassword: [
                        {validator: validatePass, trigger: ['blur', 'change']}
                    ],
                    userName: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    loginName: [
                        {required: true, message: '请填写登录名', trigger: 'blur'}
                    ],
                    email: [
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ]
                },
                // 防止重复点击
                flag: true
            }
        },
        created () {
            if (this.$route.query.roleId) {
                this.filter.roleIds.push(Number(this.$route.query.roleId))
                this.filterSearch.roleIds.push(Number(this.$route.query.roleId))
            }
        },
        mounted () {
            // 获取管理员列表
            this.getUsres()
            // 获取角色列表
            this.getRoles()
            this.generateData()
        },
        methods: {
            /**
             *
             *获取角色列表
             */
            getRoles () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getRoles(data).then(res => {
                    if (res.code.toString() === '0') {
                        // 渲染页面
                        this.selectRoleList = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            /**
             *获取角色列表
             */
            updateUserState (row) {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        userId: row.userId,
                        state: row.state === 0 ? 1 : 0
                    }
                }
                updateUserState(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.$notify({
                            title: '成功',
                            message: '修改状态成功',
                            type: 'success'
                        })
                    } else {
                        this.$message.error(res.msg)
                    }
                    // 重新取出数据
                    this.getUsres()
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            /**
             *  筛选条件重置
             */
            resetForm () {
                this.$refs.filter.resetFields()
                // 重置查询条件
                this.filter = {
                    nameOrLoginName: '',
                    state: '',
                    roleIds: []
                }
                this.filterSearch = Object.assign({}, this.filter)
                this.getUsres()
            },
            // 查询当前管理员角色
            async generateData () {
                const params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                // 查找当前管理员创建的角色列表
                const response = await queryCuurentUser(params)
                const sourseData = []
                for (let item in response.data) {
                    sourseData.push({
                        key: response.data[item].roleId,
                        label: response.data[item].roleName
                    })
                }
                this.roleList = sourseData
            },
            // 点查询，同步查询条件并提交
            getListData () {
                this.page = 1
                this.filterSearch = {...this.filter}
                this.getUsres()
            },
            /**
             * 初始化管理员列表
             */
            async getUsres () {
                const params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        filter: {
                            nameOrLoginName: this.filterSearch.nameOrLoginName,
                            state: this.filterSearch.state,
                            roleIds: this.filterSearch.roleIds
                        }
                    }
                }
                const res = await getUsers(params)
                if (res.code.toString() === '0') {
                    this.userList = res.data.list
                    this.total = res.data.total
                } else {
                    this.$message.error(res.msg)
                }
            },
            /**
             * 新增管理员
             */
            handleAddRole () {
                this.users = Object.assign({}, defaultUser)
                this.dialog.dialogVisible = true
                this.dialog.dialogType = 'new'
                // 查找当前用户创建的角色列表
                this.generateData()
            },
            /**
             * 确认添加
             */
            confirmAdd () {
                this.$refs['users'].validate((valid) => {
                    if (valid) {
                        if (this.flag) {
                            this.flag = false
                            let rolevalue = this.value
                            // 生成当前时间戳
                            this.nowTime = new Date().getTime()
                            const params = {
                                traceId: Math.random().toString(36).substr(2),
                                data: {
                                    userName: this.users.userName,
                                    loginName: this.users.loginName,
                                    password: this.users.password,
                                    email: this.users.email,
                                    phone: this.users.phone,
                                    createTime: this.nowTime,
                                    state: this.users.state ? 1 : 0
                                }
                            }
                            // 保存
                            addUsers(params).then(res => {
                                if (res.code.toString() === '0') {
                                    this.$notify({
                                        title: '成功',
                                        message: '新增管理员成功',
                                        type: 'success'
                                    })
                                    this.dialog.dialogVisible = false
                                    let params2 = {
                                        traceId: Math.random().toString(36).substr(2),
                                        data: {
                                            userId: res.data,
                                            roleIds: rolevalue
                                        }
                                    }
                                    assignRoles(params2).then(res1 => {
                                        this.flag = true
                                        // 成功才去分配角色
                                        if (res1.code.toString() === '0') {
                                            this.$notify({
                                                title: '成功',
                                                message: '授权成功',
                                                type: 'success'
                                            })
                                            this.users.password = ''
                                            this.value = []
                                            // 重新拉取数据表
                                            this.getUsres()
                                        } else {
                                            this.$notify.error({
                                                title: '错误',
                                                message: '授权失败'
                                            })
                                        }
                                    }).catch(() => {
                                        this.flag = true
                                    })
                                } else {
                                    this.$notify.error({
                                        title: '错误',
                                        message: res.msg
                                    })
                                }
                            }).catch(err => {
                                this.flag = true
                                this.$message.error(err)
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            /**
             * 点击编辑 渲染数据
             */
            operationFun (scope) {
                // 赋值用户信息
                this.users.userId = scope.row.userId
                this.users.state = scope.row.state !== 0
                this.users.userName = scope.row.userName
                this.users.loginName = scope.row.loginName
                this.users.email = scope.row.email
                this.users.phone = scope.row.phone
                this.userId = scope.row.userId
                this.dialog.dialogVisible = true
                this.dialog.dialogType = 'edit'
                // 查找当前用户创建的角色列表
                this.generateData()
                // 查找当前用户分配角色的角色列表
                const userId = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        userId: scope.row.userId
                    }
                }
                getRolesById(userId).then(res => {
                    if (res.code.toString() === '0') {
                        // 渲染页面
                        let arrVlue = []
                        for (let i in res.data) {
                            arrVlue.push(res.data[i].roleId)
                        }
                        this.value = arrVlue
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            /**
             * 确认编辑
             * 先更新信息 - 分配角色 - 权限分配
             * 每次点击的时候去设置当前用户的已经分配了那些角色
             */
            confirmEdit () {
                this.$refs['users'].validate((valid, object) => {
                    if (valid) {
                        if (this.flag) {
                            this.flag = false
                            const paramsUser = {
                                traceId: Math.random().toString(36).substr(2),
                                data: {
                                    userName: this.users.userName,
                                    loginName: this.users.loginName,
                                    password: this.users.password,
                                    email: this.users.email,
                                    phone: this.users.phone,
                                    userId: this.userId,
                                    state: this.users.state ? 1 : 0
                                }
                            }
                            // 更新操作
                            updateUser(paramsUser).then(res => {
                                if (res.code.toString() === '0') {
                                    // 成功才去操作角色（ 用户授予角色 ）
                                    const userId = {
                                        traceId: Math.random().toString(36).substr(2),
                                        data: {
                                            userId: this.userId,
                                            roleIds: this.value
                                        }
                                    }
                                    assignRoles(userId).then(res => {
                                        this.flag = true
                                        // 成功才去分配角色
                                        if (res.code.toString() === '0') {
                                            this.$notify({
                                                title: '成功',
                                                message: '编辑成功',
                                                type: 'success'
                                            })
                                            this.users.password = ''
                                            this.value = []
                                            // 加载数据
                                            this.getUsres()
                                            this.dialog.dialogVisible = false
                                        } else {
                                            this.$notify.error({
                                                title: '错误',
                                                message: '更新失败'
                                            })
                                        }
                                    }).catch(() => {
                                        this.flag = true
                                    })
                                } else {
                                    this.flag = true
                                    this.$notify.error({
                                        title: '错误',
                                        message: '更新失败'
                                    })
                                }
                            }).catch(err => {
                                this.flag = true
                                this.$message.error(err)
                            })
                        }
                    }
                })
            },
            /**
             * 修改穿梭框
             */
            handleChange (value, direction, movedKeys) {
                this.value = value
            },
            /**
             * 关闭弹框回调
             */
            closedialog () {
                this.users.password = ''
                this.value = []
                this.flag = true
            },
            /**
             * 显示查看操作记录弹窗
             * 操作日志只需要传businessDataId
             * 操作详情需传businessDataId和userId
             */
            showOperationDetail (scope) {
                this.$refs.OperationDetail.showDetail(scope.row.userId, 'user')
            }
        },
        components: {
            Pagination,
            DialogDetail
        }
    }
</script>

<style lang="scss" scoped>
    .profitloss-time {
        width: 200px;
    }

    .app-container {
        .roles-table {
            margin-top: 30px;
        }

        .permission-tree {
            margin-bottom: 30px;
        }
    }

    .state-dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 4px;
        &.brown {
            background-color: #BFBFBF;
        }
        &.green {
            background-color: #52c41a;
        }
    }

    .multiple-select {
        width: 300px;
        /deep/ .el-select__tags {
            display: flex;
            flex-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            & > span {
                display: flex;
                flex-wrap: nowrap;
            }
        }
        /deep/ .el-input--small .el-input__inner {
            height: 32px !important;
        }
    }
</style>
