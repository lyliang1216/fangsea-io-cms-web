<template>
    <div>
        <p class="roles-name" v-if="rolesName !== ''">您正在为 {{rolesName}} 配置权限，确认后生效</p>
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="权限/描述" prop="permission">
                <el-input v-model="filter.permission" size="small" placeholder="请输入权限/描述"></el-input>
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
        <el-button type="primary" @click="updateSubmit" v-if="filterSearch.roleIds.length !== 0" size="small"
                   v-auth="{id: 10600030001}">更新权限
        </el-button>
        <div class="selected-box" v-if="filterSearch.roleIds.length !== 0">
            <i class="el-icon-info"></i>
            <span>已选择<b>{{checkedMenu.length}}</b>项目</span>
            <el-button type="text" @click="clearTableSelected" size="small">清空</el-button>
        </div>
        <el-table
            ref="menuTable"
            :data="menuList"
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
                label="菜单权限"
                width="240px">
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述">
                <template slot-scope="scope">
                    <div class="table-description" :title="scope.row.description">{{scope.row.description}}</div>
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
                    <el-button type="text" @click="openEditDialog(scope.row)" size="small" v-auth="{id: 10600030002}">
                        编辑
                    </el-button>
                    <el-button type="text" size="small" v-auth="{id: 10600030003}">
                        <router-link
                            :to="{'path':'/system/authoritymanagement', 'query':{'menuId': scope.row.id, 'name': 'opera'}}"
                            tag="a" target="_blank">查看操作权限
                        </router-link>
                    </el-button>
                    <el-button type="text" size="small" v-auth="{id: 10600030004}">
                        <router-link :to="{'path':'/system/rolemanagement', 'query':{'menuId': scope.row.id}}"
                                     tag="a" target="_blank">查看角色
                        </router-link>
                    </el-button>
                    <el-button type="text" @click="openTipsDialog(scope.row)" v-if="!Number(scope.row.state)"
                               size="small" v-auth="{id: 10600030005}">开启
                    </el-button>
                    <el-button type="text" @click="operationInfo(scope)" size="small" v-auth="{id: 10600030006}">操作记录
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
            width="50%"
            custom-class="check-open">
            <el-form ref="edit" :rules="editRule" :model="edit" label-width="100px">
                <el-form-item label="菜单权限名" prop="name">
                    <el-input v-model="edit.name" size="small" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="edit.description">
                    </el-input>
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
                <el-button size="small" @click="closeTipsDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getRoles, getMenuList, updateEditMenu, checkPermission, updateRolesMenus} from '@/api/system/authority'
    import DialogDetail from '@/components/OperationDetail'

    export default {
        data () {
            return {
                // 参数角色id
                rolesId: '',
                // 参数角色名
                rolesName: '',
                filter: {
                    // 权限/描述
                    permission: '',
                    // 状态
                    state: '',
                    // 角色
                    roleIds: []
                },
                filterSearch: {
                    // 权限/描述
                    permission: '',
                    // 状态
                    state: '',
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
                // 角色列表
                rolesList: [],
                // 菜单数据列表
                menuList: [],
                // 显示开启禁用弹框
                dialogVisibleOpen: false,
                // 编辑菜单弹框
                dialogVisibleEdit: false,
                // 编辑菜单内容
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
                // 开启的数据
                checkData: {},
                // 选中的菜单权限
                checkedMenu: [],
                // 编辑菜单title
                editTitle: '编辑菜单',
                editRule: {
                    name: [
                        {required: true, max: 14, message: '请输入不超过14个字符的菜单权限名', trigger: 'blur'}
                    ],
                    description: [
                        {max: 140, message: '请输入不超过140个字符的描述内容', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            if (this.$route.query.roleId) {
                this.rolesId = this.$route.query.roleId
                this.filter.roleIds.push(Number(this.$route.query.roleId))
            }
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
                    // 角色
                    roleIds: []
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
                for (let i in this.checkedMenu) {
                    permissionMenuIds.push(this.checkedMenu[i].id)
                }
                // 原来选中的
                let listChecked = []
                for (let i in this.menuList) {
                    if (this.menuList[i].own) {
                        listChecked.push(this.menuList[i].id)
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
                    updateRolesMenus(params).then(res => {
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
             * 获取菜单列表
             */
            getList () {
                this.menuList = []
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.filterSearch
                }
                params.data.permission = this.removeSpaces(params.data.permission)
                getMenuList(params).then(res => {
                    this.checkedMenu = []
                    if (res.code.toString() === '0') {
                        if (this.$route.query.roleId) {
                            this.menuList = res.data
                        } else {
                            let hasQuery = res.data.filter(item => {
                                if (item.own) {
                                    return true
                                }
                            })
                            this.menuList = hasQuery
                        }
                        if (this.filterSearch.roleIds.length) {
                            let arr = this.menuList.filter(item => {
                                if (item.own) {
                                    return true
                                }
                            })
                            this.$nextTick(() => {
                                arr.forEach(item => {
                                    this.$refs.menuTable.toggleRowSelection(item, true)
                                })
                            })
                        } else {
                            this.menuList = res.data
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 确认开启菜单权限
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
             * 关闭提示弹框
             */
            closeTipsDialog () {
                this.dialogVisibleOpen = false
            },
            /**
             * 关闭编辑菜单提示框
             */
            closeEditDialog () {
                this.$refs.edit.resetFields()
                this.dialogVisibleEdit = false
            },
            /**
             * 编辑菜单权限
             * @param data 菜单行数据
             */
            openEditDialog (data) {
                this.editTitle = `编辑菜单（${data.name}）`
                this.edit = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
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
                        params.data.description = this.removeSpaces(params.data.description)
                        params.data.state = params.data.state ? 1 : 0
                        updateEditMenu(params).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('保存成功')
                                this.closeEditDialog()
                                this.getList()
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
                this.checkedMenu = row
            },
            /**
             * 清空选中
             */
            clearTableSelected () {
                this.$refs.menuTable.clearSelection()
                this.checkedMenu = []
            },
            /**
             * 查看操作记录
             * @param data 详情数据
             */
            operationInfo (data) {
                this.$refs.OperationDetail.showDetail(data.row.id, 'menu_authority')
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
        padding: 0 20px;
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

    .table-description {
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
