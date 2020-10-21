<template>
    <div class="app-container">
        <el-form :inline="true" ref="filter" :model="filter" class="filter-form-inline">
            <el-form-item label="快照时间" prop="chainSnapshotTime">
                <el-date-picker
                    :clearable="false"
                    v-model="filter.chainSnapshotTime"
                    type="datetime"
                    align="right"
                    size="small"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期"
                    @change="selectDate">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="币种" prop="currency">
                <el-select v-model="filter.currency" clearable filterable size="small" placeholder="">
                    <el-option
                        v-for="(item, index) in currencyList"
                        :key="index"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchList" size="small">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm" size="small">重置</el-button>
            </el-form-item>
            <el-form-item class="downloadTemplate-btn">
                <el-button type="primary" @click="downloadTemplate" size="small" v-auth="{id: 10500060001}">导出
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            v-if="total > 0"
            :data="chainData"
            style="width: 100%"
            stripe>
            <el-table-column
                prop="chainSnapshotTime"
                label="快照时间"
                width="150">
                <template slot-scope="scope">
                    {{ scope.row.chainSnapshotTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                prop="walletAddress"
                label="钱包地址">
                <template slot-scope="scope">
                    <span>{{scope.row.walletAddress}}</span>
                    <span v-if="scope.row.alias !== null">{{' (' + scope.row.alias + ')'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-for="(item, index) in tableCol"
                :key="index"
                :prop="item"
                :label="item">
                <template slot-scope="scope">
                    <span>{{scope.row[item] | filterCur}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="notdata" v-else>暂无数据</div>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="getchainData"/>
    </div>
</template>

<script>
    import {getchain, getcurrency, accountSnapshotTimeQuery} from '@/api/finance/chain'
    import Pagination from '@/components/Pagination'
    import Cookie from 'js-cookie'

    export default {
        data () {
            return {
                // 搜索条件
                filter: {
                    // 快照时间
                    chainSnapshotTime: '',
                    // 币种
                    currency: ''
                },
                // 搜索条件查询
                filterSearch: {
                    // 快找时间
                    chainSnapshotTime: '',
                    // 币种
                    currency: ''
                },
                // 币种列表
                currencyList: [],
                // 列表表头
                tableCol: [],
                // 总数据条数
                total: 0,
                // 当前页码
                currentPage: 1,
                // 每页条数
                pageSize: 10,
                // 列表数据
                chainData: [],
                // 快照生成时间
                time: ' 00:00:00'
            }
        },
        created () {
            this.accountSnapshotTimeQuery()
            this.getcurrencyList()
        },
        methods: {
            /**
             * 查询快照生成时间
             */
            accountSnapshotTimeQuery () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                accountSnapshotTimeQuery(data).then(res => {
                    if (res.code.toString() !== '0') {
                        this.$message({
                            message: '无法获取快照生成时间',
                            type: 'warning'
                        })
                    } else {
                        this.time = ' ' + res.data
                        this.getZone()
                    }
                })
            },
            /**
             * 初始化日期时间
             */
            getZone () {
                if (parseFloat(Cookie.get('zoneTime')) === 8) {
                    this.filter.chainSnapshotTime = this.parseTime(new Date().getTime() - 24 * 60 * 60 * 1000, '{y}-{m}-{d}') + this.time
                } else {
                    // 获取用户选择的时间戳，用 + 00:00:00 比较大小
                    let oldTime = new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + ' 00:00:00').getTime()
                    let newTime = new Date(new Date(new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + this.time).getTime() + (parseFloat(Cookie.get('zoneTime')) - 8) * 60 * 60 * 1000).toDateString() + ' 00:00:00').getTime()
                    // 判断处理后的时区与当前时区是否在同一天，如果不是需要同步
                    if (oldTime > newTime) {
                        this.filter.chainSnapshotTime = this.parseTime(new Date(new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + this.time).getTime() + (parseFloat(Cookie.get('zoneTime')) - 8) * 60 * 60 * 1000))
                    } else {
                        this.filter.chainSnapshotTime = this.parseTime(new Date(new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + this.time).getTime() + (parseFloat(Cookie.get('zoneTime')) - 8 - 24) * 60 * 60 * 1000))
                    }
                }
                this.filterSearch.chainSnapshotTime = this.filter.chainSnapshotTime
                this.getchainData()
            },
            /**
             * 获取币种列表
             */
            getcurrencyList () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageSize: 0
                    }
                }
                getcurrency(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.currencyList = res.data
                        this.tableCol = res.data
                    }
                })
            },
            /**
             * 点击搜索
             */
            searchList () {
                this.filterSearch = JSON.parse(JSON.stringify(this.filter))
                if (this.filter.currency !== '') {
                    for (let i in this.currencyList) {
                        if (this.currencyList[i] === this.filter.currency) {
                            this.tableCol = []
                            this.tableCol[0] = this.currencyList[i]
                            break
                        }
                    }
                } else {
                    this.tableCol = this.currencyList
                }
                this.getchainData()
            },
            /**
             * 获取链上快照列表
             */
            getchainData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        filter: JSON.parse(JSON.stringify(this.filterSearch))
                    }
                }
                getchain(params).then(res => {
                    if (res.code.toString() === '0') {
                        // 创建动态表头数据
                        let list = res.data.list
                        for (let i in list) {
                            for (let j in list[i].banlanceInfos) {
                                list[i][j] = list[i].banlanceInfos[j]
                            }
                        }
                        this.chainData = list
                        this.total = res.data.total
                    }
                })
            },
            /**
             * 重置表单
             */
            resetForm () {
                this.$refs.filter.resetFields()
                this.getZone()
                this.searchList()
            },
            /**
             * 导出表格
             */
            downloadTemplate () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.parseTime(this.filterSearch.chainSnapshotTime)
                }
                window.location.href = `/api/v2/user/wallet/chain/snapshot/export?traceId=${data.traceId}&day=${data.data}&timeZone=${Cookie.get('GMT')}`
            },
            selectDate (date) {
                this.filter.chainSnapshotTime = this.parseTime(date, '{y}-{m}-{d} {h}:{i}') + ':00'
            }
        },
        filters: {
            filterCur (val) {
                return val === undefined ? '--' : val
            }
        },
        components: {Pagination}
    }
</script>

<style lang="scss" scoped>
    .downloadTemplate-btn {
        float: right;
    }

    .notdata {
        font-size: 14px;
        line-height: 60px;
        color: #909399;
        text-align: center;
    }
</style>
