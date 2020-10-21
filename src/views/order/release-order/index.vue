<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline releaseOrderSearch"
                 ref="releaseOrderSearch">
            <el-form-item label="订单ID" prop="orderId">
                <el-input v-model="searchFormData.orderId" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="" prop="searchProjectInput">
                <el-input placeholder="请输入内容" v-model="searchFormData.searchProjectInput"
                          class="input-with-select inline-input">
                    <el-select v-model="searchFormData.searchProjectSelect" filterable slot="prepend" placeholder="请选择"
                               style="width: 120px;">
                        <el-option label="ticker" value="0"></el-option>
                        <el-option label="项目编号" value="1"></el-option>
                        <el-option label="项目名称" value="2"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="" prop="searchMemberInput">
                <el-input placeholder="请输入内容" v-model="searchFormData.searchMemberInput"
                          class="input-with-select inline-input">
                    <el-select v-model="searchFormData.searchMemberSelect" filterable slot="prepend" placeholder="请选择"
                               style="width: 120px;">
                        <el-option label="投资人UID" value="0"></el-option>
                        <el-option label="推荐人UID" value="1"></el-option>
                        <el-option label="投资人Email" value="3"></el-option>
                        <el-option label="投资人手机" value="2"></el-option>
                        <el-option label="投资人名字" value="4"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="支付币种" prop="selectedCurrency">
                <el-select v-model="searchFormData.selectedCurrency" clearable filterable @change="changeCur"
                           placeholder="请选择">
                    <el-option
                        v-for="item in curList"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单时间" prop="orderDate">
                <el-date-picker
                    v-model="searchFormData.orderDate"
                    type="daterange"
                    range-separator="至"
                    format="yyyy-MM-dd"
                    :default-time="['00:00:00','23:59:59']"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="订单状态" prop="searchOrderState">
                <el-select v-model="searchFormData.searchOrderState"
                           :class="isOrderStateSelectAll ? 'orderStateSelectAll' : ''"
                           @change="selectAll" clearable filterable
                           multiple placeholder="" style="width: 350px;">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getListData">查询</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table stripe
                  :data="listData"
                  @sort-change="sortTable"
                  style="width: 100%">
            <el-table-column
                prop="investNo"
                label="订单ID"
                width="200"
                sortable="custom">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间"
                width="160"
                sortable="custom">
                <template slot-scope="props">
                    {{ props.row.createTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                prop="userCode"
                label="投资人UID"
                width="120"
                sortable="custom">
            </el-table-column>
            <el-table-column
                prop="projectNumber"
                width="120"
                label="项目编号">
            </el-table-column>
            <el-table-column
                prop="ptCurCode"
                label="ticker">
            </el-table-column>
            <el-table-column
                prop="ptTotalAmount"
                min-width="100"
                label="认购数量"
                sortable="custom">
            </el-table-column>
            <el-table-column
                prop="curCode"
                label="支付币种">
                <template slot-scope="props">
                    {{ props.row.curCode ? props.row.curCode : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                label="单价">
            </el-table-column>
            <el-table-column
                prop="curAmount"
                label="支付金额"
                min-width="100"
                sortable="custom">
            </el-table-column>
            <el-table-column
                prop="email"
                label="订单状态">
                <template slot-scope="props">
                    {{ matchState(props.row.state) }}
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList()"/>
    </div>
</template>

<script>
    import {getReleaseOrderList, getPayCueCode} from '@/api/order/release-order'
    import Pagination from '@/components/Pagination'

    export default {
        components: {Pagination},
        data () {
            return {
                // 查询条件
                searchFormData: {
                    orderId: '',
                    searchProjectSelect: '0',
                    searchProjectInput: '',
                    searchMemberSelect: '0',
                    searchMemberInput: '',
                    searchOrderState: ['all', '0', '1', '2'],
                    orderDate: null,
                    selectedCurrency: ''
                },
                // 查询条件（搜索）
                searchFormDataFilter: {
                    orderId: '',
                    searchProjectSelect: '0',
                    searchProjectInput: '',
                    searchMemberSelect: '0',
                    searchMemberInput: '',
                    searchOrderState: ['all', '0', '1', '2'],
                    orderDate: null,
                    selectedCurrency: ''
                },
                // 订单状态选项
                options: [{
                    value: 'all',
                    label: '全部'
                }, {
                    value: '0',
                    label: '投资成功'
                }, {
                    value: '2',
                    label: '投资完成'
                }, {
                    value: '1',
                    label: '已退款'
                }],
                // 默认订单状态选中项
                oldOptions: ['all', '0', '1', '2'],
                // 订单状态是否全选
                isOrderStateSelectAll: true,
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
                // 币种列表
                curList: []
            }
        },
        created () {
            if (this.$route.query.uid) {
                this.searchFormData.searchMemberInput = this.$route.query.uid
            }
            if (this.$route.query.ticker) {
                this.searchFormData.searchProjectInput = this.$route.query.ticker
            }
            if (this.$route.query.ident && this.$route.query.ident !== '') {
                switch (this.$route.query.ident) {
                case 'amount':
                    this.searchFormData.searchOrderState = ['2']
                    this.isOrderStateSelectAll = false
                    break
                case 'count':
                    this.searchFormData.searchOrderState = ['all', '0', '1', '2']
                    break
                }
            }
            if (this.$route.query.date && this.$route.query.date !== '') {
                this.searchFormData.orderDate = [
                    this.$route.query.date.split(',')[0],
                    this.$route.query.date.split(',')[1]
                ]
            }
            if (this.$route.query.curCode) {
                this.searchFormData.selectedCurrency = this.$route.query.curCode
            }
            // 初始化数据
            this.getListData()
            this.getPayCueCode()
        },
        methods: {
            // 点查询
            getListData () {
                this.page = 1
                this.searchFormDataFilter = JSON.parse(JSON.stringify(this.searchFormData))
                this.getList()
            },
            // 获取订单列表
            getList () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.page,
                        pageSize: this.limit,
                        filter: {}
                    }
                }
                if (this.searchFormDataFilter.orderId !== '') {
                    formData.data.filter['investNo'] = this.searchFormDataFilter.orderId
                }
                // ticker等筛选
                if (this.searchFormDataFilter.searchProjectInput !== '') {
                    formData.data.filter['findObjectType'] = this.searchFormDataFilter.searchProjectSelect
                    formData.data.filter['findObjectValue'] = this.searchFormDataFilter.searchProjectInput
                }
                // 投资人UID等筛选
                if (this.searchFormDataFilter.searchMemberInput !== '') {
                    formData.data.filter['findUserType'] = this.searchFormDataFilter.searchMemberSelect
                    formData.data.filter['findUserValue'] = this.searchFormDataFilter.searchMemberInput
                }
                // 是否选择下单日期
                if (this.searchFormDataFilter.orderDate !== null) {
                    formData.data.filter['startTime'] = this.searchFormDataFilter.orderDate[0]
                    formData.data.filter['endTime'] = this.searchFormDataFilter.orderDate[1]
                }
                // 支付币种选择
                if (this.searchFormDataFilter.selectedCurrency !== '') {
                    formData.data.filter['curCode'] = this.searchFormDataFilter.selectedCurrency
                }
                // 投资状态筛选
                if (this.searchFormDataFilter.searchOrderState.includes('all')) {
                    formData.data.filter['findState'] = ['0', '1', '2']
                } else {
                    formData.data.filter['findState'] = this.searchFormDataFilter.searchOrderState
                }
                // 是否有排序
                if (this.sortRule !== '') {
                    formData.data.filter['orderByType'] = this.sortRule.split('|')[0]
                    formData.data.filter['orderByValue'] = this.sortRule.split('|')[1]
                }
                formData.data.filter = this.removeSpaces(formData.data.filter)
                this.searchFormData = this.removeSpaces(this.searchFormData)
                getReleaseOrderList(formData).then(res => {
                    if (res.code.toString() === '0') {
                        let data = res.data
                        this.listData = data.list
                        this.total = data.total
                        this.page = data.pageNum
                        this.limit = data.pageSize
                    }
                })
            },
            // 排序监听
            sortTable (params) {
                let sort = ''
                if (params.order) {
                    sort = params.prop + '|' + (params.order === 'ascending' ? 'asc' : 'desc')
                    this.sortRule = sort
                    this.getList()
                } else {
                    this.sortRule = ''
                    this.getList()
                }
            },
            /**
             *  筛选条件重置
             */
            resetForm () {
                this.$refs.releaseOrderSearch.resetFields()
                this.searchFormData.searchProjectSelect = '0'
                this.searchFormData.searchMemberSelect = '0'
                this.searchFormData.orderDate = null
                this.searchFormData.searchMemberInput = ''
                this.searchFormData.searchOrderState = ['all', '0', '1', '2']
                this.oldOptions = ['all', '0', '1', '2']
                this.isOrderStateSelectAll = true
                this.getListData()
            },
            // 改变选中币种数据
            changeCur (e) {
                this.searchFormData.selectedCurrency = e
            },
            // 获取支付币种
            getPayCueCode () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getPayCueCode(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.curList = res.data
                    }
                })
            },
            /**
             * 订单状态选择逻辑
             * @param val 选中项value集合
             */
            selectAll (val) {
                let allValues = []
                // 保留所有值
                for (let item of this.options) {
                    allValues.push(item.value)
                }
                // 用来储存上一次的值，可以进行对比
                const oldVal = this.oldOptions.length === 0 ? [] : this.oldOptions

                // 若是全部选择
                if (val.includes('all')) this.searchFormData.searchOrderState = allValues

                // 取消全部选中  上次有 当前没有 表示取消全选
                if (oldVal.includes('all') && !val.includes('all')) this.searchFormData.searchOrderState = []

                // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
                // 新老数据都有全部选中
                if (oldVal.includes('all') && val.includes('all')) {
                    const index = val.indexOf('all')
                    val.splice(index, 1) // 排除全选选项
                    this.searchFormData.searchOrderState = val
                }

                // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
                if (!oldVal.includes('all') && !val.includes('all')) {
                    if (val.length === allValues.length - 1) this.searchFormData.searchOrderState = ['all'].concat(val)
                }

                // 若没有选择任何选项，则默认全部选中
                if (this.searchFormData.searchOrderState.length === 0) {
                    this.searchFormData.searchOrderState = allValues
                    this.$message.warning('订单状态为必选项，若您未选择任何选项，系统将恢复全选状态')
                }

                // 若最终结果全选，则隐藏外部'全部'选项
                if (this.searchFormData.searchOrderState.includes('all')) {
                    this.isOrderStateSelectAll = true
                } else {
                    this.isOrderStateSelectAll = false
                }
                // 储存当前最后的结果 作为下次的老数据
                this.oldOptions = this.searchFormData.searchOrderState
            },
            matchState (state) {
                switch (state) {
                case '0':
                    return '投资成功'
                case '1':
                    return '已退款'
                case '2':
                    return '投资完成'
                }
            },
            // 截取时间字符串
            substr (str) {
                let newStr = str.substring(0, 16)
                return newStr
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-range-editor .el-range-input {
        margin-left: 5px;
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
