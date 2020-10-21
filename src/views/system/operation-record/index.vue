<template>
    <div class="app-container">
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="编号" prop="number">
                <el-input v-model="filter.number" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="业务模块" prop="businessModels">
                <el-select class="multiple-select" v-model="filter.businessModels" multiple clearable filterable
                           size="small" placeholder="请选择">
                    <el-option
                        v-for="item in businessModuleList"
                        :key="item.businessId"
                        :label="item.businessName"
                        :value="item.businessValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务流水号" prop="serialNumber">
                <el-input v-model="filter.serialNumber" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="UserID/姓名" prop="userIds">
                <el-select class="multiple-select" v-model="filter.userIds" multiple clearable filterable size="small"
                           placeholder="请选择">
                    <el-option
                        v-for="item in usersList"
                        :key="item.userId"
                        :label="`${item.userId}(${item.userName})`"
                        :value="item.userId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="操作行为" prop="operantBehavior">
                <el-input v-model="filter.operantBehavior" size="small" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                    clearable
                    size="small"
                    style="width: 400px;"
                    v-model="time"
                    type="daterange"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="timestamp"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getListData" size="small">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            class="recordtable"
            :data="tableData"
            @sort-change="sortTable"
            stripe
            style="width: 100%">
            <el-table-column
                prop="number"
                sortable="custom"
                label="编号"
                width="100">
            </el-table-column>
            <el-table-column
                prop="businessModelName"
                sortable="custom"
                label="业务模块">
            </el-table-column>
            <el-table-column
                prop="operantBehavior"
                label="操作行为">
            </el-table-column>
            <el-table-column
                prop="userId"
                sortable="custom"
                width="100"
                label="userID">
            </el-table-column>
            <el-table-column
                prop="operator"
                width="150"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="operatorRole"
                label="角色">
                <template slot-scope="props">
                    <div class="overflow-hide" :title="props.row.operatorRole">{{props.row.operatorRole}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="operatorTime"
                sortable="custom"
                width="160"
                label="时间">
                <template slot-scope="props">
                    {{props.row.operatorTime | getZoneTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="serialNumber"
                label="业务流水号">
            </el-table-column>
            <el-table-column
                prop="opera"
                width="100"
                label="操作">
                <template slot-scope="props">
                    <el-button type="primary" size="small" @click="operationInfo(props)" v-auth="{id: 10600040001}">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="searchlist"/>
        <!-- 操作详情弹窗-->
        <dialog-detail :isDetail="true" ref="OperationDetail"/>
    </div>
</template>

<script>
    import {businessModel, operationList, getUsers} from '@/api/system/operation-record'
    import DialogDetail from '@/components/OperationDetail'
    import Pagination from '@/components/Pagination'

    export default {
        name: 'index',
        data () {
            return {
                // userId列表
                usersList: [],
                // 业务模板列表
                businessModuleList: [],
                // 筛选条件
                filter: {
                    // 编号
                    number: '',
                    // 业务模块
                    businessModels: [],
                    // 业务流水号
                    serialNumber: '',
                    // userId
                    userIds: [],
                    // 操作行为
                    operantBehavior: '',
                    // 开始时间
                    startTime: '',
                    // 结束时间
                    endTime: '',
                    // 排序字段
                    orderField: 'number',
                    // 是否降序
                    orderDesc: true
                },
                // 选择时间
                time: null,
                // 筛选条件（查询）
                filterSearch: {
                    // 编号
                    number: '',
                    // 业务模块
                    businessModels: [],
                    // 业务流水号
                    serialNumber: '',
                    // userId
                    userIds: [],
                    // 操作行为
                    operantBehavior: '',
                    // 开始时间
                    startTime: '',
                    // 结束时间
                    endTime: '',
                    // 排序字段
                    orderField: 'number',
                    // 是否降序
                    orderDesc: true
                },
                // 表格数据
                tableData: [],
                // 当前页
                currentPage: 1,
                // 总数据条数
                total: 0,
                // 每页条数
                pageSize: 10
            }
        },
        created () {
            this.getBusinessModel()
            this.getUserId()
            this.searchlist()
        },
        methods: {
            /**
             * 获取userId列表
             */
            getUserId () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: 1,
                        pageSize: 100
                    }
                }
                getUsers(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.usersList = res.data.list
                    }
                })
            },
            /**
             * 获取业务模版列表
             */
            getBusinessModel () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                businessModel(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.businessModuleList = res.data.businessModels
                    }
                })
            },
            /**
             * 点击搜索
             */
            getListData () {
                this.currentPage = 1
                if (this.time) {
                    this.filter.startTime = this.time[0] / 1000
                    this.filter.endTime = this.time[1] / 1000
                }
                this.filter = this.removeSpaces(this.filter)
                this.filterSearch = JSON.parse(JSON.stringify(this.filter))
                this.searchlist()
            },
            /**
             * 搜索筛选
             */
            searchlist () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        filter: JSON.parse(JSON.stringify(this.filterSearch))
                    }
                }
                operationList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.tableData = res.data.list
                        this.total = res.data.total
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             *  重置搜索条件
             */
            resetForm () {
                this.$refs.filter.resetFields()
                this.filter.startTime = ''
                this.filter.endTime = ''
                this.time = null
                this.getListData()
            },
            /**
             * 排序监听
             * @param params 排序参数 descending降序 ascending升序
             */
            sortTable (params) {
                if (params.order) {
                    this.filter.orderField = params.prop
                    this.filter.orderDesc = params.order === 'descending'
                    this.filterSearch.orderField = params.prop
                    this.filterSearch.orderDesc = params.order === 'descending'
                } else {
                    this.filter.orderField = 'number'
                    this.filter.orderDesc = true
                    this.filterSearch.orderField = 'number'
                    this.filterSearch.orderDesc = true
                }
                this.searchlist()
            },
            /**
             * 查看详情
             * @param data 详情数据
             */
            operationInfo (data) {
                this.$refs.OperationDetail.showDetail(data.row.businessDataId, data.row.businessModel, data.row.userId)
            }
        },
        components: {
            Pagination,
            DialogDetail
        }
    }
</script>

<style lang="scss" scoped>
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

    .overflow-hide {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
