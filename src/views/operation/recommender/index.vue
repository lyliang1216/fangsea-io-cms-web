<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline recommenderSearch"
                 ref="recommenderSearch">
            <el-form-item label="" prop="searchInput">
                <el-input placeholder="请输入内容" v-model="searchFormData.searchInput"
                          class="input-with-select inline-input">
                    <el-select v-model="searchFormData.searchSelect" filterable slot="prepend" placeholder="请选择"
                               style="width: 120px;">
                        <el-option label="推荐人UID" value="0"></el-option>
                        <el-option label="投资人UID" value="1"></el-option>
                        <el-option label="手机号码" value="2"></el-option>
                        <el-option label="Email" value="3"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="支付币种" prop="selectedCurrency">
                <el-select v-model="searchFormData.selectedCurrency" filterable clearable @change="changeCur"
                           placeholder="请选择">
                    <el-option
                        v-for="item in curList"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="注册时间" prop="signDate">
                <el-date-picker
                    v-model="searchFormData.signDate"
                    type="daterange"
                    range-separator="至"
                    format="yyyy-MM-dd"
                    :default-time="['00:00:00','23:59:59']"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
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
            <el-form-item>
                <el-button type="primary" @click="getRecommenderList('searched')">查询</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        <p v-if="totalData">
            认购订单量共计 {{totalData.count === null ? 0 : totalData.count}}
            <span v-if="totalData.refundCount" class="red"> - {{totalData.refundCount}}</span>
            <span v-if="searchFormDataFilter.selectedCurrency !== ''">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认购PT金额共计  {{totalData.total.length === 0 ? 0 : totalData.total[0].curAmount ? totalData.total[0].curAmount : 0}}
            <span v-if="totalData.total.length > 0 && totalData.total[0].refundCurAmount" class="red"> - {{totalData.total[0].refundCurAmount}}</span></span>
        </p>
        <el-table stripe
                  :data="recommenderData"
                  @sort-change="sortTable"
                  style="width: 100%">
            <el-table-column
                prop="userCode"
                width="120"
                label="投资人UID"
                sortable="custom">
                <template slot-scope="props">
                    <router-link class="link-style"
                                 :to="{'path':'/operation/memberlist','query':{'uid':props.row.userCode}}" tag="a"
                                 target="_blank">
                        {{props.row.userCode}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="mobile"
                width="160"
                label="手机">
                <template slot-scope="props">
                    {{ props.row.mobile ? '+' + props.row.areaCode+ ' ' + props.row.mobile : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="email"
                label="Email">
                <template slot-scope="props">
                    {{ props.row.email ? props.row.email : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="level"
                label="多级推荐">
                <template slot-scope="props">
                    <el-popover
                        placement="bottom"
                        trigger="click">
                        <div v-html="getRecommendList(props.row.recommendList)"></div>
                        <p slot="reference" style="cursor: pointer;"><span style="text-decoration: underline">{{ props.row.recommendList.length - 1 }}</span></p>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="referrerUserCode"
                label="推荐人UID"
                width="120"
                sortable="custom">
                <template slot-scope="props">
                    <router-link class="link-style"
                                 :to="{'path':'/operation/memberlist','query':{'uid':props.row.referrerUserCode}}"
                                 tag="a" target="_blank">
                        {{props.row.referrerUserCode}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="registerTime"
                label="注册时间"
                sortable="custom"
                width="160">
                <template slot-scope="props">
                    {{ props.row.registerTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                prop="count"
                label="预售订单量"
                width="120"
                sortable="custom">
                <template slot-scope="props">
                    <router-link class="link-style" v-if="props.row.count"
                                 :to="{'path':'/order/releaseorder',
                                 'query':{'uid':props.row.userCode,
                                 'date':(orderDate[0] && orderDate[0] !== '')?orderDate[0]+','+orderDate[1]:'',
                                 'curCode': props.row.curCode,
                                 'ident': 'count'}}"
                                 tag="a" target="_blank">
                        {{ props.row.count }}<span v-if="props.row.refundCount"
                                                   class="red"> - {{props.row.refundCount}}</span>
                    </router-link>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="curCode"
                width="120"
                label="支付币种">
                <template slot-scope="props">
                    {{ props.row.curCode ? props.row.curCode : '-' }}
                </template>
            </el-table-column>
            <el-table-column
                prop="sumCurAmount"
                min-width="160"
                label="预售订单支付金额"
                sortable="custom">
                <template slot-scope="props">
                    <router-link class="link-style" v-if="props.row.sumCurAmount"
                                 :to="{'path':'/order/releaseorder',
                                 'query':{'uid':props.row.userCode,
                                 'date':(orderDate[0] && orderDate[0] !== '')?orderDate[0]+','+orderDate[1]:'',
                                 'curCode': props.row.curCode,
                                 'ident': 'count'}}"
                                 tag="a" target="_blank">
                        {{ props.row.sumCurAmount }}<span v-if="props.row.refundCurAmount" class="red"> - {{props.row.refundCurAmount}}</span>
                    </router-link>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="completeCount"
                label="已发行订单量"
                width="140"
                sortable="custom">
                <template slot-scope="props">
                    <router-link class="link-style" v-if="props.row.completeCount"
                                 :to="{'path':'/order/releaseorder',
                                 'query':{'uid':props.row.userCode,
                                 'date':(orderDate[0] && orderDate[0] !== '')?orderDate[0]+','+orderDate[1]:'',
                                 'curCode': props.row.curCode,
                                 'ident': 'amount'}}"
                                 tag="a" target="_blank">
                        {{ props.row.completeCount }}
                    </router-link>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="completeCurAmount"
                label="已发行订单支付金额"
                min-width="170"
                sortable="custom">
                <template slot-scope="props">
                    <router-link class="link-style" v-if="props.row.completeCurAmount"
                                 :to="{'path':'/order/releaseorder',
                                 'query':{'uid':props.row.userCode,
                                 'date':(orderDate[0] && orderDate[0] !== '')?orderDate[0]+','+orderDate[1]:'',
                                 'curCode': props.row.curCode,
                                 'ident': 'amount'}}"
                                 tag="a" target="_blank">
                        {{ props.row.completeCurAmount }}
                    </router-link>
                    <span v-else>-</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit"
                    @pagination="getRecommenderList()"/>
    </div>
</template>

<script>
    import {getRecommenderList, getRecommenderTotal, getPayCueCode} from '@/api/operation/recommender'
    import {getZoneTimeTamp} from '@/utils/filters'
    import Pagination from '@/components/Pagination'

    export default {
        components: {Pagination},
        filters: {
            getZoneTimeTamp
        },
        data () {
            return {
                // 查询条件
                searchFormData: {
                    searchSelect: '0',
                    selectedCurrency: '',
                    searchInput: '',
                    signDate: '',
                    orderDate: ''
                },
                // 查询条件(搜索)
                searchFormDataFilter: {
                    searchSelect: '0',
                    selectedCurrency: '',
                    searchInput: '',
                    signDate: '',
                    orderDate: ''
                },
                // 推荐人列表数据
                recommenderData: [],
                // 统计数据
                totalData: null,
                // 数据总数
                total: 0,
                // 当前页码
                page: 1,
                // 分页条数
                limit: 10,
                // 排序规则
                sortRule: '',
                // 查询的订单时间选择
                orderDate: '',
                // 币种列表
                curList: []
            }
        },
        created () {
            // 初始化数据
            this.getRecommenderList()
            this.getPayCueCode()
        },
        methods: {
            /**
             *  获取推荐人列表数据
             */
            getRecommenderList (str) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.page,
                        pageSize: this.limit,
                        filter: {}
                    }
                }
                if (str === 'searched') {
                    this.searchFormDataFilter = Object.assign({}, this.searchFormData)
                }
                // 查询条件
                switch (this.searchFormDataFilter.searchSelect) {
                case '0':
                    formData.data.filter['referrerUserCode'] = this.searchFormDataFilter.searchInput
                    break
                case '1':
                    formData.data.filter['userCode'] = this.searchFormDataFilter.searchInput
                    break
                case '2':
                    formData.data.filter['mobile'] = this.searchFormDataFilter.searchInput
                    break
                case '3':
                    formData.data.filter['email'] = this.searchFormDataFilter.searchInput
                    break
                default:
                    break
                }
                // 支付币种选择
                if (this.searchFormDataFilter.selectedCurrency !== '') {
                    formData.data.filter['curCode'] = this.searchFormDataFilter.selectedCurrency
                }
                // 是否选择注册时间
                if (this.searchFormDataFilter.signDate && this.searchFormDataFilter.signDate[0] && this.searchFormDataFilter.signDate[0] !== '') {
                    formData.data.filter['registerTimeStart'] = this.searchFormDataFilter.signDate[0]
                    formData.data.filter['registerTimeEnd'] = this.searchFormDataFilter.signDate[1]
                } else {
                    this.orderDate = ''
                }
                // 是否选择下单日期
                if (this.searchFormDataFilter.orderDate && this.searchFormDataFilter.orderDate[0] && this.searchFormDataFilter.orderDate[0] !== '') {
                    formData.data.filter['orderTimeStart'] = this.searchFormDataFilter.orderDate[0]
                    formData.data.filter['orderTimeEnd'] = this.searchFormDataFilter.orderDate[1]
                    this.orderDate = this.searchFormDataFilter.orderDate
                } else {
                    this.orderDate = ''
                }
                // 是否有排序
                if (this.sortRule !== '') {
                    formData.data.orderBy = this.sortRule
                }
                formData.data.filter = this.removeSpaces(formData.data.filter)
                this.searchFormData = this.removeSpaces(this.searchFormData)
                getRecommenderList(formData).then(response => {
                    let res = response.data
                    this.recommenderData = res.list
                    this.total = res.total
                    this.page = res.pageNum
                    this.limit = res.pageSize
                })
                this.getRecommenderTotal(formData.data.filter)
            },
            /**
             *  获取推荐人统计数据
             */
            getRecommenderTotal (filter) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: filter
                }
                getRecommenderTotal(formData).then(res => {
                    this.totalData = res.data
                })
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
            // 重置搜索表单
            resetSearchForm () {
                this.$refs.recommenderSearch.resetFields()
                this.searchFormData.searchSelect = '0'
                this.getRecommenderList('searched')
            },
            // 排序监听
            sortTable (params) {
                let sort = ''
                if (params.order) {
                    sort = params.prop + ' ' + (params.order === 'ascending' ? 'asc' : 'desc')
                    this.sortRule = sort
                    this.getRecommenderList()
                } else {
                    this.sortRule = ''
                    this.getRecommenderList()
                }
            },
            // 改变选中币种数据
            changeCur (e) {
                this.searchFormData.selectedCurrency = e
            },
            getZoneTimeTamp (str) {
                return getZoneTimeTamp(str)
            },
            /**
             * 推荐人层级显示
             * @param arr 推荐人集合
             */
            getRecommendList (arr) {
                let html = ''
                for (let i in arr) {
                    if (Number(i) === arr.length - 1) {
                        html += `<span style="color: #8e8e8e;">${arr[i]}</span>`
                    } else {
                        html += `<span>${arr[i]}&rarr;</span>`
                    }
                }
                return html
            }
        }
    }
</script>

<style lang="scss" scoped>
    .red {
        color: red;
    }

    .link-style {
        color: #2ea9df;
    }
</style>

<style lang="scss">
    .recommenderSearch .el-input-group__prepend, .searchForm .el-input-group__append {
        background-color: #fff;
    }
</style>
