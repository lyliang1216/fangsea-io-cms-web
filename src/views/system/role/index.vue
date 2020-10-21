<template>
    <div class="app-container">
        <!--<el-button type="primary" size="small" @click="handleAddRole">新增角色</el-button>-->
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="角色/描述" prop="desc">
                <el-input v-model="filter.desc" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select class="multiple-select" v-model="filter.status"
                           size="small" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="开启" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单/操作权限" prop="rules">
                <el-select class="multiple-select" v-model="filter.rules" multiple clearable filterable
                           size="small" placeholder="请选择">
                    <el-option
                        v-for="item in operationList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getRoles('searched')" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="handleAddRole" v-auth="{id: 10600020001}">+ 新建角色</el-button>
        <!-- 表单数据 -->
        <el-table :data="rolesList"
                  style="width: 100%;margin-top:30px;"
                  stripe>
            <el-table-column label="编号" width="80">
                <template slot-scope="scope">
                    {{ scope.row.roleId }}
                </template>
            </el-table-column>
            <el-table-column label="名称" width="220">
                <template slot-scope="scope">
                    {{ scope.row.roleName }}
                </template>
            </el-table-column>
            <el-table-column label="描述">
                <template slot-scope="scope">
                    <div class="table-description" :title="scope.row.description">{{scope.row.description}}</div>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <span class="state-dot gray" v-if="scope.row.state === '0'"></span>
                    <span class="state-dot green" v-else-if="scope.row.state === '1'"></span> {{
                    scope.row.state === '1' ? '开启' : '禁用' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.roleName !== 'admin'"
                        type="text"
                        size="small"
                        v-auth="{id: 10600020002}"
                        @click="operationFun( scope )"> 编辑
                    </el-button>
                    <el-button
                        v-auth="{id: 10600020003}"
                        v-if="scope.row.roleName !== 'admin'"
                        type="text"
                        size="small">
                        <router-link :to="{'path':'/system/authoritymanagement', 'query':{'roleId': scope.row.roleId}}"
                                     tag="a" target="_blank">配置权限
                        </router-link>
                    </el-button>
                    <el-button
                        v-auth="{id: 10600020004}"
                        v-if="scope.row.roleName !== 'admin'"
                        type="text"
                        size="small">
                        <router-link :to="{'path':'/system/usermanagement', 'query':{'roleId': scope.row.roleId}}"
                                     tag="a" target="_blank">查看用户
                        </router-link>
                    </el-button>
                    <el-button
                        v-auth="{id: 10600020005}"
                        v-if="scope.row.roleName !== 'admin'"
                        size="small"
                        type="text"
                        @click="remove( scope )"> 删除
                    </el-button>
                    <el-button
                        v-auth="{id: 10600020006}"
                        v-if="scope.row.roleName !== 'admin' && scope.row.state === '0'"
                        size="small"
                        type="text"
                        @click="updateRuleState(scope)"> 开启
                    </el-button>
                    <el-button
                        v-auth="{id: 10600020007}"
                        v-if="scope.row.roleName !== 'admin'"
                        size="small"
                        type="text"
                        @click="showOperationDetail(scope)"> 操作记录
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="getRoles"/>
        <!-- 弹出层 -->
        <el-dialog :visible.sync="dialog.dialogVisibleAdd"
                   @close="closedialog"
                   :close-on-click-modal="false"
                   label-width="120px"
                   :title="dialog.dialogType === 'edit' ? '编辑角色' : '新增角色'">
            <el-form :model="role"
                     :rules="partRules"
                     ref="editRule"
                     label-width="80px"
                     class="role-permission-form"
                     label-position="right">
                <el-form-item label="名称" prop="name">
                    <el-input
                        style="width: 60%"
                        v-model="role.name"
                        placeholder="请输入名称..."/>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input
                        style="width: 60%"
                        v-model="role.description"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入描述... "/>
                </el-form-item>
                <el-form-item label="开启角色" prop="checked">
                    <el-checkbox v-model="role.checked">开启</el-checkbox>
                </el-form-item>
            </el-form>
            <div style="text-align:right; display: flex;justify-content: center">
                <el-button type="danger" @click="dialog.dialogVisibleAdd = false" size="small"> 取消</el-button>
                <el-button v-if="dialog.dialogType === 'edit' ? false : true" size="small" type="primary"
                           @click="ruleAdd"> 确认
                </el-button>
                <el-button v-if="dialog.dialogType === 'edit' ? true : false" size="small" type="primary"
                           @click="ruleEdit"> 确认
                </el-button>
            </div>
        </el-dialog>
        <!-- 操作记录弹窗-->
        <dialog-detail :isDetail="false" ref="OperationDetail"/>
    </div>
</template>

<script>
    import {getRoles, addRole, updateRole, deleteRole, getRolesOpreation, updateRuleState} from '@/api/system/role'
    import DialogDetail from '@/components/OperationDetail'
    import Pagination from '@/components/Pagination'

    const defaultRole = {
        name: '',
        description: '',
        checked: false
    }

    export default {
        data () {
            const checkName = (rule, value, callback) => {
                if (this.role.name === '') {
                    return callback(new Error('请填写角色名称'))
                } else if (this.role.name.length > 14) {
                    return callback(new Error('角色名称不超过14个字符'))
                } else {
                    return callback()
                }
            }
            return {
                role: Object.assign({}, defaultRole),
                partRules: {
                    name: {required: true, validator: checkName, trigger: 'blur'},
                    description: {max: 140, message: '请输入不超过140个字符的描述内容', trigger: 'blur'}
                },
                rolesList: [],
                // 弹出层
                dialog: {
                    dialogVisibleAdd: false,
                    dialogType: 'new'
                },
                // 当前页
                currentPage: 1,
                // 总条数
                total: 0,
                // 每页显示数量
                pageSize: 10,
                // 时间戳
                nowTime: '',
                // 角色id
                roleId: '',
                //  查询条件
                filter: {
                    desc: '',
                    status: '',
                    rules: []
                },
                // 筛选条件（查询）
                filterSearch: {
                    desc: '',
                    status: '',
                    rules: []
                },
                // 权限下拉类表数据
                operationList: []
            }
        },
        created () {
            if (this.$route.query.menuId) {
                this.filter.rules.push(parseInt(this.$route.query.menuId))
            } else if (this.$route.query.operaId) {
                this.filter.rules.push(parseInt(this.$route.query.operaId))
            }
        },
        mounted () {
            // 获取角色列表
            this.getRoles('searched')
            this.getRolesOpreation()
        },
        methods: {
            /**
             * 初始化用户列表
             */
            async getRoles (str) {
                if (str === 'searched') {
                    this.filterSearch = Object.assign({}, this.filter)
                }
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage.toString(),
                        pageSize: this.pageSize.toString(),
                        filter: {}
                    }
                }
                if (this.filterSearch.desc !== '') {
                    params.data.filter.roleNameOrDesc = this.filterSearch.desc
                }
                if (this.filterSearch.status !== '') {
                    params.data.filter.state = this.filterSearch.status
                }
                if (this.filterSearch.rules.length !== 0) {
                    params.data.filter.permissionId = this.filterSearch.rules
                }
                const res = await getRoles(params)
                this.rolesList = res.data.list
                this.total = res.data.total
                this.pageSize = res.data.pageSize
                this.currentPage = res.data.pageNum
            },
            /**
             * 获取菜单操作下拉数据
             */
            getRolesOpreation () {
                let param = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getRolesOpreation(param).then(res => {
                    if (res.code.toString() === '0') {
                        this.operationList = res.data
                    }
                })
            },
            /**
             * 新增角色
             */
            handleAddRole () {
                this.role = Object.assign({}, defaultRole)
                this.dialog.dialogVisibleAdd = true
                this.dialog.dialogType = 'new'
            },
            /**
             * 关闭新增、编辑角色弹窗
             */
            closedialog () {
                this.role = Object.assign({}, defaultRole)
                this.dialog.dialogVisibleAdd = false
                this.dialog.dialogType = 'new'
            },
            /**
             * 新增角色
             */
            ruleAdd () {
                this.$refs['editRule'].validate((valid) => {
                    if (valid) {
                        let param = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                roleName: this.role.name,
                                description: this.role.description,
                                state: this.role.checked ? '1' : '0'
                            }
                        }
                        addRole(param).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('新增成功')
                                this.closedialog()
                                this.getRoles()
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            /**
             * 点击编辑 渲染数据
             */
            operationFun (scope) {
                this.dialog.dialogVisibleAdd = true
                this.dialog.dialogType = 'edit'
                // 赋值用户信息
                this.role.name = scope.row.roleName
                this.role.description = scope.row.description
                this.roleId = scope.row.roleId
                this.role.checked = scope.row.state !== '0'
            },
            /**
             * 保存编辑
             */
            ruleEdit (scope) {
                this.$refs['editRule'].validate((valid) => {
                    if (valid) {
                        let param = {
                            traceId: Math.random().toString(36).substr(2),
                            data: {
                                roleName: this.role.name,
                                description: this.role.description,
                                state: this.role.checked ? '1' : '0',
                                roleId: this.roleId
                            }
                        }
                        updateRole(param).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('保存成功')
                                this.closedialog()
                                this.getRoles()
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            /**
             * 开启角色
             */
            updateRuleState (scope) {
                this.$confirm('<p>确认开启角色<span style="color: red">' + scope.row.roleName + '</span></p>', '提示', {
                    confirmButtonText: '开启',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    closeOnClickModal: false
                }).then(() => {
                    let param = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            roleId: scope.row.roleId,
                            state: '1'
                        }
                    }
                    updateRuleState(param).then(res => {
                        if (res.code.toString() === '0') {
                            this.$message.success('开启成功')
                            this.getRoles()
                        }
                    })
                })
            },
            /**
             * 删除
             */
            remove (scope) {
                this.$confirm('<p>删除角色<span style="color: red">' + scope.row.roleName + '</span>后将无法恢复，已经关联该角色的用户及所有权限将解除关联，是否继续删除</p>', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    closeOnClickModal: false
                }).then(() => {
                    const params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            roleId: scope.row.roleId
                        }
                    }
                    deleteRole(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.$message.success('删除角色成功')
                        } else {
                            this.$message.error(res.msg)
                        }
                        // 重新取出数据
                        this.getRoles()
                    }).catch(err => {
                        this.$message.error(err)
                    })
                }).catch(() => {
                })
            },
            /**
             *  重置搜索条件
             */
            resetForm () {
                this.$refs.filter.resetFields()
                this.filter.status = ''
                this.filter.rules = []
                this.getRoles('searched')
            },
            /**
             * 显示查看操作记录弹窗
             * 操作日志只需要传businessDataId
             * 操作详情需传businessDataId和userId
             */
            showOperationDetail (scope) {
                this.$refs.OperationDetail.showDetail(scope.row.roleId, 'role')
            }
        },
        components: {Pagination, DialogDetail}
    }
</script>

<style lang="scss" scoped>
    .app-container {
        .roles-table {
            margin-top: 30px;
        }

        .permission-tree {
            margin-bottom: 30px;
        }
    }

    /*/deep/ .role-permission-form .el-form-item:last-child > div {*/
    /*padding-top: 45px;*/
    /*}*/

    .checkall {
        margin-right: 8px;
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

    .state-dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 4px;
        &.gray {
            background-color: rgb(191, 191, 191);
        }
        &.green {
            background-color: #52c41a;
        }
    }

    .table-description {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
