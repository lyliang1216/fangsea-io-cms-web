<template>
    <div>
        <p class="roles-name" v-if="rolesName !== ''">您正在为 {{rolesName}} 配置权限，确认后生效</p>
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="操作权限" prop="permission">
                <el-input v-model="filter.permission" size="small" placeholder="请输入操作权限"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-select v-model="filter.state" clearable filterable size="small" placeholder="请选择状态">
                    <el-option
                        v-for="item in stateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属菜单/模块" prop="menuPermissionIds">
                <el-select class="multiple-select" v-model="filter.menuIds" :disabled="hasMenuId" clearable filterable
                           multiple size="small" placeholder="请选择所属菜单/模块">
                    <el-option
                        v-for="item in MenusList"
                        :key="item.id"
                        :label="item.grandMenuName ? `${item.grandMenuName} / ${item.menuName} / ${item.name}` : `${item.menuName} / ${item.name}`"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleId" v-if="rolesId === ''">
                <el-select class="multiple-select" v-model="filter.roleIds" clearable filterable multiple size="small"
                           placeholder="请选择角色">
                    <el-option
                        v-for="item in rolesList"
                        :disabled="item.roleName === 'admin'"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchList" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="updateSubmit" size="small" v-if="filterSearch.roleIds.length !== 0"
                   v-auth="{id: 10600030008}">更新权限
        </el-button>
        <div class="selected-box" v-if="filterSearch.roleIds.length !== 0">
            <i class="el-icon-info"></i>
            <span>已选择<b>{{checkedOpera.length}}</b>项目</span>
            <el-button type="text" @click="clearTableSelected" size="small">清空</el-button>
        </div>
        <el-table
            ref="operaTable"
            :data="operaList"
            style="width: 100%"
            @selection-change="selecttr"
            stripe>
            <el-table-column
                v-if="filterSearch.roleIds.length !== 0"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                label="操作权限"
                width="240px">
            </el-table-column>
            <el-table-column
                prop="menuName"
                label="所属菜单/模块">
                <template slot-scope="scope">
                    <div class="table-menuPermissionName">{{scope.row.topMenuName ? scope.row.topMenuName + ' / ' :
                        ''}}{{scope.row.grandMenuName}} / {{scope.row.menuName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="state"
                label="状态"
                width="120px">
                <template slot-scope="scope">
                    <span class="state-dot state-dot-open" v-if="Number(scope.row.state)"></span><span
                    class="state-dot state-dot-close" v-else></span>{{ scope.row.state | getState }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="openEditDialog(scope.row)" size="small" v-auth="{id: 10600030009}">
                        编辑
                    </el-button>
                    <el-button type="text" size="small" v-auth="{id: 10600030010}">
                        <router-link :to="{'path':'/system/rolemanagement', 'query':{'operaId': scope.row.id}}"
                                     tag="a" target="_blank">查看角色
                        </router-link>
                    </el-button>
                    <el-button type="text" @click="openTipsDialog(scope.row)" v-if="!Number(scope.row.state)"
                               size="small" v-auth="{id: 10600030011}">开启
                    </el-button>
                    <el-button type="text" @click="operationInfo(scope)" size="small" v-auth="{id: 10600030012}">操作记录
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 操作详情弹窗-->
        <dialog-detail :isDetail="true" ref="OperationDetail"/>
        <el-dialog
            :title="editTitle"
            :visible.sync="dialogVisibleEdit"
            :close-on-click-modal="false"
            width="400px"
            custom-class="check-open">
            <el-form ref="edit" :rules="editRule" :model="edit" label-width="100px">
                <el-form-item label="所属菜单/模块" prop="menuIds">
                    <el-select v-model="edit.menuIds" clearable filterable disabled size="small" placeholder="">
                        <el-option
                            v-for="item in MenusList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作权限名" prop="name">
                    <el-input v-model="edit.name" size="small" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="" prop="permission">
                    <el-checkbox v-model="edit.state">开启权限</el-checkbox>
                </el-form-item>
            </el-form>
            <div class="footer">
                <el-button size="small" type="primary" @click="saveEditDialog">保存</el-button>
                <el-button size="small" @click="closeEditDialog">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisibleOpen"
            :close-on-click-modal="false"
            width="400px"
            custom-class="check-open">
            <p class="word">确认开启 <span>{{checkData.name}}</span></p>
            <div class="footer">
                <el-button size="small" type="primary" @click="checkChoose">开启</el-button>
                <el-button size="small" @click="dialogVisibleOpen = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getMenuList,
        getRoles,
        getOperaList,
        checkPermission,
        updateEditOpera,
        updateRolesMenusOpera
    } from '@/api/system/authority'
    import DialogDetail from '@/components/OperationDetail'

    export default {
        data () {
            return {
                // 参数角色id
                rolesId: '',
                // 参数角色名
                rolesName: '',
                // 带参查询（菜单）
                hasMenuId: false,
                filter: {
                    // 权限/描述
                    permission: '',
                    // 状态
                    state: '',
                    // 菜单
                    menuIds: [],
                    // 角色
                    roleIds: []
                },
                filterSearch: {
                    // 权限/描述
                    permission: '',
                    // 状态
                    state: '',
                    // 菜单
                    menuIds: [],
                    // 角色
                    roleIds: []
                },
                // 状态列表
                stateList: [{
                    label: '全部',
                    value: ''
                }, {
                    label: '开启',
                    value: '1'
                }, {
                    label: '禁用',
                    value: '0'
                }],
                // 菜单列表
                MenusList: [],
                // 角色列表
                rolesList: [],
                // 菜单数据列表
                operaList: [],
                // 显示开启禁用弹框
                dialogVisibleOpen: false,
                // 编辑菜单弹框
                dialogVisibleEdit: false,
                // 编辑操作权限内容
                edit: {
                    // 菜单id
                    id: '',
                    // 菜单名
                    name: '',
                    // 描述
                    description: '',
                    // 开启状态
                    state: ''
                },
                // 开启禁用的数据
                checkData: {},
                // 选中的操作权限
                checkedOpera: [],
                // 编辑操作权限
                editTitle: '编辑（操作权限：）',
                editRule: {
                    name: [
                        {required: true, max: 14, message: '请输入不超过14个字符的操作权限名', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            if (this.$route.query.menuId) {
                this.filter.menuIds.push(Number(this.$route.query.menuId))
                this.hasMenuId = true
            }
            if (this.$route.query.roleId) {
                this.rolesId = this.$route.query.roleId
                this.filter.roleIds.push(Number(this.$route.query.roleId))
            }
            this.getMenusList()
            this.getRolesList()
            this.searchList()
        },
        methods: {
            /**
             * 查询角色Id对应name
             * @param id 角色id
             */
            getRoleName (id) {
                for (let i in this.rolesList) {
                    if (this.rolesList[i].roleId.toString() === id) {
                        this.rolesName = this.rolesList[i].roleName
                        break
                    }
                }
            },
            /**
             * 获取菜单列表
             */
            getMenusList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getMenuList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.MenusList = res.data
                    }
                })
            },
            /**
             * 获取角色列表下拉框
             */
            getRolesList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getRoles(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.rolesList = res.data
                        if (this.$route.query.roleId) {
                            this.getRoleName(this.$route.query.roleId)
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 点击查询
             */
            searchList () {
                this.filterSearch = JSON.parse(JSON.stringify(this.filter))
                this.getList()
            },
            /**
             * 重置筛选条件
             */
            resetForm () {
                this.$refs.filter.resetFields()
                this.filter = {
                    // 权限/描述
                    permission: '',
                    // 状态
                    state: '',
                    // 菜单
                    menuIds: [],
                    // 角色
                    roleIds: []
                }
                this.hasMenuId = false
                if (this.$route.query.menuId) {
                    this.filter.menuPermissionIds.push(Number(this.$route.query.menuId))
                    this.hasMenuId = true
                }
                if (this.$route.query.roleId) {
                    this.filter.roleIds.push(Number(this.$route.query.roleId))
                }
                this.searchList()
            },
            /**
             * 提交更新
             */
            updateSubmit () {
                // 当前选中的
                let permissionMenuIds = []
                for (let i in this.checkedOpera) {
                    permissionMenuIds.push(this.checkedOpera[i].id)
                }
                // 原来选中的
                let listChecked = []
                for (let i in this.operaList) {
                    if (this.operaList[i].own) {
                        listChecked.push(this.operaList[i].id)
                    }
                }
                // 新增的
                let add = permissionMenuIds.filter(item => !listChecked.includes(item))
                // 取消的
                let del = listChecked.filter(item => !permissionMenuIds.includes(item))
                if (add.length === 0 && del.length === 0) {
                    this.getList()
                } else {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            roleIds: this.filterSearch.roleIds,
                            usablePermissionIds: add,
                            disablePermissionIds: del
                        }
                    }
                    updateRolesMenusOpera(params).then(res => {
                        if (res.code.toString() === '0') {
                            this.$message.success('更新成功')
                            this.getList()
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                }
            },
            /**
             * 获取操作列表
             */
            getList () {
                this.operaList = []
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.filterSearch
                }
                params.data.permission = this.removeSpaces(params.data.permission)
                getOperaList(params).then(res => {
                    this.checkedOpera = []
                    if (res.code.toString() === '0') {
                        if (this.$route.query.roleId) {
                            this.operaList = res.data
                        } else {
                            let hasQuery = res.data.filter(item => {
                                if (item.own) {
                                    return true
                                }
                            })
                            this.operaList = hasQuery
                        }
                        if (this.filterSearch.roleIds.length) {
                            let arr = res.data.filter(item => {
                                if (item.own) {
                                    return true
                                }
                            })
                            this.$nextTick(() => {
                                arr.forEach(item => {
                                    this.$refs.operaTable.toggleRowSelection(item, true)
                                })
                            })
                        } else {
                            this.operaList = res.data
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 确认开启禁用操作权限
             */
            checkChoose () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.checkData.id
                }
                checkPermission(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success(this.checkData.name + '开启成功')
                        this.getList()
                        this.dialogVisibleOpen = false
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 打开提示弹框
             * @param data 行数据
             */
            openTipsDialog (data) {
                this.checkData = data
                this.dialogVisibleOpen = true
            },
            /**
             * 关闭编辑菜单提示框
             */
            closeEditDialog () {
                this.$refs.edit.resetFields()
                this.dialogVisibleEdit = false
            },
            /**
             * 编辑操作权限
             * @param data 菜单行数据
             */
            openEditDialog (data) {
                this.editTitle = `编辑（操作权限：${data.name}）`
                this.edit = {
                    id: data.id,
                    name: data.name,
                    menuIds: data.menuId,
                    state: Boolean(Number(data.state))
                }
                this.dialogVisibleEdit = true
            },
            /**
             * 提交编辑菜单
             */
            saveEditDialog () {
                this.$refs['edit'].validate((valid) => {
                    if (valid) {
                        let params = {
                            traceId: Math.random().toString(36).substr(2),
                            data: this.edit
                        }
                        params.data.name = this.removeSpaces(params.data.name)
                        params.data.state = params.data.state ? 1 : 0
                        delete params.data.menuIds
                        updateEditOpera(params).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('保存成功')
                                this.getList()
                                this.closeEditDialog()
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            /**
             *  选中获取
             *  @param row 选中的行
             * */
            selecttr (row) {
                this.checkedOpera = row
            },
            /**
             * 清空选中
             */
            clearTableSelected () {
                this.$refs.operaTable.clearSelection()
                this.checkedOpera = []
            },
            /**
             * 查看操作记录
             * @param data 详情数据
             */
            operationInfo (data) {
                this.$refs.OperationDetail.showDetail(data.row.id, 'operation_authority')
            }
        },
        filters: {
            getState (state) {
                return Number(state) ? '启用' : '禁用'
            }
        },
        components: {
            DialogDetail
        }
    }
</script>

<style lang="scss" scoped>
    .roles-name {
        color: #f00;
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

    .check-open {
        .word {
            text-align: center;
            margin-top: 0;
            font-size: 16px;
            span {
                color: #f00
            }
        }
        .footer {
            padding-top: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            button {
                margin: 0 10px;
            }
        }
    }

    .selected-box {
        height: 42px;
        background: #E6F7FF;
        border: 1px solid #D3EFFC;
        border-radius: 5px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 20px;
        margin: 10px 0;
        font-size: 16px;
        .el-icon-info {
            color: #2EA9DF;
        }
        span {
            font-size: 16px;
            margin-left: 10px;
        }
        b {
            font-weight: normal;
            color: #2EA9DF;
        }
        button {
            font-size: 16px;
            margin-left: 20px;
        }
    }

    .table-menuPermissionName {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .state-dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 4px;
        &.state-dot-open {
            background-color: #54C31C;
        }
        &.state-dot-close {
            background-color: #bfbfbf;
        }
    }
</style>
