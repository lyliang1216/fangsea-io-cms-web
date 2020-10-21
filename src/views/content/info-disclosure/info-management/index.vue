<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline" ref="historySearch">
            <el-form-item label="类别" prop="categoryId">
                <el-select v-model="searchFormData.categoryId" filterable clearable placeholder="类别">
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id.toString()">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联项目(PT)" prop="projectIdList">
                <el-select class="associated-project" v-model="searchFormData.projectIdList" multiple filterable
                           clearable placeholder="关联项目(PT)">
                    <el-option
                        v-for="item in projectList"
                        :key="item.projectId"
                        :label="item.ptCurCode"
                        :value="item.projectId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="searchFormData.status" filterable placeholder="状态">
                    <el-option value="" label="全部"/>
                    <el-option value="1" label="待发布"/>
                    <el-option value="0" label="已发布"/>
                    <el-option value="2" label="已撤回"/>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="searchFormData.title" placeholder="标题"/>
            </el-form-item>
            <el-form-item label="发布日期" prop="appointmentTime">
                <el-date-picker
                    v-model="searchFormData.appointmentTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="updateStatus('searched')">查询</el-button>
                <el-button size="small" @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            stripe
            :data="listData"
            @sort-change="sortTable"
            style="width: 100%">
            <el-table-column
                prop="categoryName"
                label="类别">
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="ptCurCode"
                label="PT">
                <template slot-scope="props">
                    <div class="pt-Cur-Code" :title="props.row.ptCurCode === null ? '' : props.row.ptCurCode">{{
                        props.row.ptCurCode === null ? `-` : props.row.ptCurCode }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                width="120px"
                label="状态">
                <template slot-scope="props">
                    {{ matchState(props.row.status) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="appointmentTime"
                label="发布时间"
                width="200px"
                sortable="custom">
                <template slot-scope="props">
                    {{ props.row.appointmentTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                width="200px"
                label="操作">
                <template slot-scope="props">
                    <a v-auth="{id: 10400013003}" v-if="props.row.status === 1 || props.row.status ===2"
                       @click="jumpToEdit(props.row.id)" class="operate" href="javascript:;">编辑</a>
                    <a v-auth="{id: 10400013001}" v-if="props.row.status === 0"
                       @click="withdrawHistoricalDisclosure(props.row.id)" class="operate" href="javascript:;">撤回</a>
                    <a v-auth="{id: 10400013002}" class="operate" @click="showProject(props.row)" href="javascript:;">关联项目</a>
                    <a v-auth="{id: 10400013004}" v-if="props.row.status !== 0"
                       @click="deleteHistoricalDisclosure(props.row.id)" class="operate" href="javascript:;">删除</a>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit"
                    @pagination="updateStatus()"/>
        <!--关联项目-->
        <el-dialog class="project-box" v-el-drag-dialog :visible.sync="dialogProject"
                   :close-on-click-modal="false" :show-close="false" title="关联项目">
            <i class="el-icon-close closeproject" @click="closeDialogProject"></i>
            <el-form ref="form" label-width="100px" class="article-form">
                <el-form-item label="关联项目(PT)" prop="projectIdList">
                    <el-select class="associated-project" v-model="itemProject" ref="projectIdList" multiple clearable
                               filterable size="small" placeholder="请选择关联项目(PT)">
                        <el-option
                            v-for="item in projectList"
                            :key="item.projectId"
                            :label="item.ptCurCode"
                            :value="item.projectId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button class="publicInfo-save" size="small" type="primary" @click="saveProject"
                           :loading="subLoading">保&emsp;&nbsp;存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        updateStatus, getHistoricalDisclosureList,
        withdrawHistoricalDisclosure, deleteHistoricalDisclosure, saveDisclosureProject, getTree, getProject
    } from '@/api/content/disclosure-history'
    import elDragDialog from '@/directives/el-dragDialog'
    import Pagination from '@/components/Pagination'

    export default {
        directives: {elDragDialog},
        data () {
            return {
                // 查询数据集合
                searchFormData: {
                    // 类型
                    categoryId: '',
                    // 关联项目
                    projectIdList: [],
                    // 状态
                    status: '',
                    // 标题
                    title: '',
                    // 发布日期
                    appointmentTime: ''
                },
                // 已提交过的查询条件
                oldSearchFormData: {
                    // 类型
                    categoryId: '',
                    // 关联项目
                    projectIdList: [],
                    // 状态
                    status: '',
                    // 标题
                    title: '',
                    // 发布日期
                    appointmentTime: ''
                },
                // 列表数据
                listData: [],
                // 类型列表
                typeList: [],
                // 关联项目列表
                projectList: [],
                // 数据总数
                total: 0,
                // 当前页码
                page: 1,
                // 分页条数
                limit: 10,
                // 排序规则
                sortRule: '',
                // 弹窗表单提交时等待状态
                subLoading: false,
                // 是否显示关联项目弹窗
                dialogProject: false,
                // 条目对应关联项目数据
                itemProject: [],
                // 条目对应id
                itemId: ''
            }
        },
        created () {
            // 初始化数据
            this.getCategory()
            this.getProject()
            this.updateStatus()
        },
        methods: {
            // 获取类别数据
            getCategory () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getTree(params).then(res => {
                    this.typeList = res.data.zh_CN
                })
            },
            // 获取关联项目数据
            getProject () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getProject(params).then(res => {
                    this.projectList = res.data
                })
            },
            // 触发待发布文章状态更新
            updateStatus (str) {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                updateStatus(params).then(res => {
                    this.getList(str)
                })
            },
            // 获取历史披露列表
            getList (str) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.page,
                        pageSize: this.limit,
                        filter: {}
                    }
                }
                if (str === 'searched') {
                    this.oldSearchFormData = Object.assign({}, this.searchFormData)
                }
                if (this.oldSearchFormData.title !== '') {
                    params.data.filter['title'] = this.oldSearchFormData.title
                }
                if (this.oldSearchFormData.projectIdList !== []) {
                    params.data.filter['projectIdList'] = this.oldSearchFormData.projectIdList
                }
                if (this.oldSearchFormData.categoryId !== '') {
                    params.data.filter['categoryId'] = this.oldSearchFormData.categoryId
                }
                if (this.oldSearchFormData.status !== '') {
                    params.data.filter['status'] = this.oldSearchFormData.status
                }
                // 是否选择下单日期
                if (this.oldSearchFormData.appointmentTime[0] && this.oldSearchFormData.appointmentTime[0] !== '') {
                    params.data.filter['startTime'] = this.getZoneTime(Date.parse(this.oldSearchFormData.appointmentTime[0]) / 1000).substring(0, 10) + ' 00:00:00'
                    params.data.filter['endTime'] = this.getZoneTime(Date.parse(this.oldSearchFormData.appointmentTime[1]) / 1000 + 24 * 3600 - 1).substring(0, 10) + ' 23:59:59'
                }
                // 是否有排序
                if (this.sortRule !== '') {
                    params.data.filter['orderBy'] = this.sortRule
                }
                params.data.filter = this.removeSpaces(params.data.filter)
                this.searchFormData = this.removeSpaces(this.searchFormData)
                getHistoricalDisclosureList(params).then(res => {
                    this.listData = res.data.list
                    this.page = res.data.pageNum
                    this.total = res.data.total
                })
            },
            // 撤回披露消息
            withdrawHistoricalDisclosure (id_) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: id_,
                        status: 2
                    }
                }
                this.$confirm('如果撤回，部分投资人会发现该消息被撤回', '慎重操作！', {
                    confirmButtonText: '撤回',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    showClose: false,
                    type: 'warning',
                    center: true
                }).then(() => {
                    withdrawHistoricalDisclosure(params).then(res => {
                        this.$message.success('撤回成功')
                        this.updateStatus()
                    })
                }).catch(() => {
                })
            },
            // 删除披露消息
            deleteHistoricalDisclosure (id_) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: id_
                }
                this.$confirm('如果删除，系统将无法恢复该披露信息', '慎重操作！', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    showClose: false,
                    type: 'warning',
                    center: true
                }).then(() => {
                    deleteHistoricalDisclosure(params).then(res => {
                        this.$message.success('删除成功')
                        this.updateStatus()
                    })
                }).catch(() => {
                })
            },
            // 跳转编辑
            jumpToEdit (id_) {
                this.$router.push({
                    path: '/contentmanage/infodisclosure/editinforelease',
                    query: {id: id_}
                })
            },
            // 重置查询表单
            resetSearchForm () {
                this.$refs.historySearch.resetFields()
                this.searchFormData.appointmentTime = ''
                this.updateStatus('searched')
            },
            // 状态匹配文字
            matchState (state) {
                switch (state) {
                case 0:
                    return '已发布'
                case 1:
                    return '待发布'
                case 2:
                    return '已撤回'
                }
            },
            // 排序监听
            sortTable (params) {
                let sort = ''
                if (params.order) {
                    sort = params.order === 'ascending' ? 'asc' : 'desc'
                    this.sortRule = sort
                    this.getList()
                } else {
                    this.sortRule = ''
                    this.getList()
                }
            },
            // 显示关联项目弹窗
            showProject (item) {
                this.itemProject = item.projectIdList
                this.itemId = item.id
                this.dialogProject = true
            },
            // 保存关联项目数据
            saveProject () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: this.itemId,
                        projectIdList: this.itemProject
                    }
                }
                saveDisclosureProject(params).then(res => {
                    this.getCategory()
                    this.getProject()
                    this.updateStatus()
                    this.closeDialogProject()
                })
            },
            // 关闭关联项目弹窗
            closeDialogProject () {
                this.dialogProject = false
                this.itemProject = []
            }
        },
        components: {
            Pagination
        }
    }
</script>

<style lang="scss" scoped>
    .operate {
        margin-right: 8px;
        color: #2EA9DF;
    }

    .associated-project {
        width: 400px;
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
    }

    .pt-Cur-Code {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .project-box {
        .closeproject {
            position: absolute;
            top: 20px;
            right: 20px;
            color: #909399;
            font-size: 16px;
            cursor: pointer;
            &:hover {
                color: rgb(59, 170, 223);
            }
        }
    }

    .btns {
        text-align: center;
    }
</style>
