<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline releaseOrderSearch"
                 ref="releaseOrderSearch">
            <el-form-item label="编号" prop="orderId">
                <el-input v-model="searchFormData.number" placeholder="请输入" size="small" class="profitloss-time"/>
            </el-form-item>
            <el-form-item label="损益类型" prop="selectedCurrency">
                <el-select v-model="searchFormData.profitType" clearable filterable size="small" placeholder="请选择"
                           class="profitloss-time">
                    <el-option
                        v-for="item in profitCategory"
                        :key="item.id"
                        :label="item.categoryName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目/Ticker" prop="selectedCurrency">
                <el-select v-model="searchFormData.ptCurCode" clearable filterable size="small" placeholder="请选择"
                           class="profitloss-time">
                    <el-option
                        v-for="item in tickers"
                        :key="item.projectId"
                        :label="item.ptCurCode"
                        :value="item.ptCurCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="selectedCurrency">
                <el-select v-model="searchFormData.state" clearable filterable size="small" placeholder="请选择"
                           class="profitloss-time">
                    <el-option
                        v-for="item in types"
                        :key="item.code"
                        :label="item.desc"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="selectedCurrency">
                <el-select v-model="searchFormData.timeType" clearable filterable size="small" placeholder="请选择"
                           class="profitloss-time">
                    <el-option
                        v-for="item in timeTypes"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="orderDate">
                <el-date-picker
                    size="small"
                    :disabled="searchFormData.timeType === ''"
                    v-model="searchFormData.orderDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="getListData">查询</el-button>
                <el-button size="small" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
            :data="listData"
            @sort-change="sortTable"
            stripe
            style="width: 100%">
            <el-table-column
                prop="number"
                width="120px"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="profitType"
                width="120px"
                label="损益类型">
            </el-table-column>
            <el-table-column
                prop="tickers"
                label="项目/Ticker">
                <template slot-scope="props">
                    {{ props.row.tickers | getTickers }}
                </template>
            </el-table-column>
            <el-table-column
                prop="proDescribe"
                label="描述">
            </el-table-column>
            <el-table-column
                prop="state"
                width="120px"
                label="状态">
                <template slot-scope="props">
                    <span class="state-dot brown" v-if="props.row.state === 0"></span>
                    <span class="state-dot blue" v-else-if="props.row.state === 1"></span>
                    <span class="state-dot green" v-else-if="props.row.state === 2"></span> {{ props.row.state |
                    getStates }}
                </template>
            </el-table-column>
            <el-table-column
                prop="endTime"
                width="200px"
                label="截止时间"
                sortable="custom">
                <template slot-scope="props">
                    {{props.row.endTime | getZoneTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="updateTime"
                width="200px"
                label="更新时间"
                sortable="custom">
                <template slot-scope="props">
                    {{props.row.updateTime | getZoneTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="serialNumber"
                width="200px"
                label="业务流水号">
            </el-table-column>
            <el-table-column
                width="150px"
                label="操作">
                <template slot-scope="props">
                    <a class="operate" href="javascript:;" @click="edititem(props.row, 0)"
                       v-auth="{id: 10300010001}">详情</a>
                    <a class="operate" href="javascript:;" @click="edititem(props.row, 1)" v-if="props.row.state === 0"
                       v-auth="{id: 10300010002}">编辑</a>
                    <a class="operate" href="javascript:;" @click="edititem(props.row, 2)" v-if="props.row.state === 1"
                       v-auth="{id: 10300010003}">结算</a>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList()"/>
    </div>
</template>

<script>
    import {queryProfitCategory, queryTicker, queryStates, queryDetailsList} from '@/api/post-investment/profit-loss'
    import Pagination from '@/components/Pagination'

    export default {
        data () {
            return {
                // 查询条件
                searchFormData: {
                    // 编号
                    'number': '',
                    // 损益类别
                    'profitType': '',
                    // 项目Ticker
                    'ptCurCode': '',
                    // 状态 0清算中、 1待结算、 2已结算
                    'state': '',
                    // 0:截止时间 1：更新时间
                    'timeType': '',
                    // 按更新时间排序 0：默认 1：升序 2：降序
                    orderByUpdateTime: 0,
                    // 按截止时间排序 0：默认 1：升序 2：降序
                    orderByEndTime: 0,
                    // 日期
                    'orderDate': []
                },
                // 查询条件（提交搜索）
                searchFormDataFilter: {
                    // 编号
                    'number': '',
                    // 损益类别
                    'profitType': '',
                    // 项目Ticker
                    'ptCurCode': '',
                    // 状态 0清算中、 1待结算、 2已结算
                    'state': '',
                    // 0:截止时间 1：更新时间
                    'timeType': '',
                    // 按更新时间排序 0：默认 1：升序 2：降序
                    orderByUpdateTime: 0,
                    // 按截止时间排序 0：默认 1：升序 2：降序
                    orderByEndTime: 0,
                    // 日期
                    'orderDate': []
                },
                // 列表数据
                listData: [],
                // 数据总数
                total: 0,
                // 当前页码
                page: 1,
                // 分页条数
                limit: 10,
                // 排序规则
                sortRule: '',
                // 损益类型
                profitCategory: [],
                // ticker
                tickers: [],
                // 损益状态
                types: [],
                // 时间类型
                timeTypes: [{
                    type: 0,
                    name: '截止时间'
                }, {
                    type: 1,
                    name: '更新时间'
                }]
            }
        },
        created () {
            // 初始化数据
            this.getListData()
            this.queryProfitCategory()
            this.queryTicker()
            this.queryStates()
        },
        methods: {
            // 获取损益类别
            queryProfitCategory () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: 0
                    }
                }
                queryProfitCategory(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.profitCategory = res.data
                    }
                })
            },
            // 获取项目ticker
            queryTicker () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                queryTicker(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.tickers = res.data
                    }
                })
            },
            // 获取损益状态
            queryStates () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                queryStates(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.types = res.data
                    }
                })
            },
            // 点查询，同步查询条件并提交
            getListData () {
                this.page = 1
                this.searchFormDataFilter = {...this.searchFormData}
                this.getList()
            },
            // 获取订单列表
            getList () {
                let startTime = ''
                let endTime = ''
                if (this.searchFormDataFilter.orderDate && this.searchFormDataFilter.orderDate.length > 0) {
                    startTime = this.searchFormDataFilter.orderDate[0]
                    endTime = this.searchFormDataFilter.orderDate[1]
                }
                let filter = {
                    // 编号
                    'number': this.removeSpaces(this.searchFormDataFilter.number),
                    // 损益类别
                    'profitType': this.searchFormDataFilter.profitType,
                    // 项目Ticker
                    'ptCurCode': this.searchFormDataFilter.ptCurCode,
                    // 状态 0清算中、 1待结算、 2已结算
                    'state': this.searchFormDataFilter.state,
                    // 0:截止时间 1：更新时间
                    'timeType': this.searchFormDataFilter.timeType,
                    // 按更新时间排序 0：默认 1：升序 2：降序
                    orderByUpdateTime: this.searchFormDataFilter.orderByUpdateTime,
                    // 按截止时间排序 0：默认 1：升序 2：降序
                    orderByEndTime: this.searchFormDataFilter.orderByEndTime,
                    // 开始日期
                    startTime,
                    // 结束日期
                    endTime
                }
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.page,
                        pageSize: this.limit,
                        filter
                    }
                }
                queryDetailsList(formData).then(res => {
                    if (res.code.toString() === '0') {
                        if (res.data) {
                            this.listData = res.data.list
                            this.total = res.data.total
                        } else {
                            this.listData = []
                            this.total = 0
                        }
                    }
                })
            },
            // 操作
            edititem (row, type) {
                switch (type) {
                // 详情
                case 0 :
                    this.$router.push({
                        path: '/postinvestment/dividendsdetails',
                        query: {details: 1, profitId: row.id}
                    })
                    break
                    // 编辑
                case 1 :
                    this.$router.push({path: '/postinvestment/editdividends', query: {profitId: row.id}})
                    break
                    // 结算
                case 2 :
                    this.$router.push({path: '/postinvestment/financesettle', query: {profitId: row.id}})
                    break
                }
            },
            // 排序监听
            sortTable (params) {
                if (params.prop === 'endTime') {
                    if (params.order) {
                        this.searchFormDataFilter.orderByEndTime = params.order === 'ascending' ? 1 : 2
                    } else {
                        this.searchFormDataFilter.orderByEndTime = 0
                    }
                    this.searchFormDataFilter.orderByUpdateTime = 0
                } else {
                    if (params.order) {
                        this.searchFormDataFilter.orderByUpdateTime = params.order === 'ascending' ? 1 : 2
                    } else {
                        this.searchFormDataFilter.orderByUpdateTime = 0
                    }
                    this.searchFormDataFilter.orderByEndTime = 0
                }
                this.getList()
            },
            /**
             *  筛选条件重置
             */
            resetForm () {
                this.$refs.releaseOrderSearch.resetFields()
                // 重置查询条件
                this.searchFormData = {
                    // 编号
                    'number': '',
                    // 损益类别
                    'profitType': '',
                    // 项目Ticker
                    'ptCurCode': '',
                    // 状态 0清算中、 1待结算、 2已结算
                    'state': '',
                    // 0:截止时间 1：更新时间
                    'timeType': '',
                    // 按更新时间排序 0：默认 1：升序 2：降序
                    orderByUpdateTime: 0,
                    // 按截止时间排序 0：默认 1：升序 2：降序
                    orderByEndTime: 0,
                    // 日期
                    'orderDate': []
                }
                this.getListData()
            }
        },
        filters: {
            // 处理损益状态
            getStates (state) {
                switch (state) {
                case 0 :
                    return '清算中'
                case 1 :
                    return '待结算'
                case 2 :
                    return '已结算'
                }
            },
            // 合并tickers
            getTickers (tickers) {
                let ticker = ''
                tickers.forEach((item, index) => {
                    if (index !== tickers.length - 1) {
                        ticker += item.ptCurCode + ','
                    } else {
                        ticker += item.ptCurCode
                    }
                })
                return ticker
            }
        },
        components: {Pagination}
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-range-editor .el-range-input {
        margin-left: 5px;
    }

    .operate {
        color: #2ea9df;
        width: 40px;
        display: inline-block;
    }

    .profitloss-time {
        width: 150px;
    }

    .profitloss-td {
        width: 150px;
    }

    .state-dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 4px;
        &.brown {
            background-color: #a19316;
        }
        &.blue {
            background-color: #1890ff;
        }
        &.green {
            background-color: #52c41a;
        }
    }
</style>

<style lang="scss">
    .releaseOrderSearch .el-input-group__prepend, .searchForm .el-input-group__append {
        background-color: #fff;
    }

    .orderStateSelectAll .el-select__tags .el-tag:first-child {
        display: none;
    }
</style>
