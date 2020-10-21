<template>
    <div class="app-container">
        <div class="tools" v-show="hasTime">
            <p class="content-title">快照时间</p>
            <el-date-picker
                :clearable="false"
                class="picker-shot"
                v-model="value"
                type="datetime"
                align="right"
                size="small"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                @change="selectDate">
            </el-date-picker>
            <el-button type="primary" @click="currentChange" size="small">搜索</el-button>
            <el-button @click="resetForm" size="small">重置</el-button>
            <!-- 导出 -->
            <div class="load-out">
                <el-button
                    v-auth="{id: 10500050001}"
                    size="small"
                    type="primary"
                    @click="checkoutData">
                    导出
                </el-button>
            </div>
        </div>
        <el-table
            v-if="tableData && tableData.length !== 0" stripe
            :data="tableData"
            style="width: 100%"
            header-cell-class-name="recharge-header-bg">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-tabs type="border-card">
                        <el-tab-pane label="详细">
                            <el-table stripe
                                      :data="props.row.detail"
                                      style="width: 100%">
                                <el-table-column
                                    label="币种"
                                    prop="currency">
                                </el-table-column>
                                <el-table-column
                                    label="可用"
                                    prop="usable">
                                </el-table-column>
                                <el-table-column
                                    label="冻结"
                                    prop="freeze">
                                </el-table-column>
                                <el-table-column
                                    label="锁仓"
                                    prop="locked">
                                </el-table-column>
                                <el-table-column
                                    label="最后更新时间"
                                    prop="updateTime">
                                    <template slot-scope="props">
                                        {{ props.row.updateTime | getZoneTime }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </el-table-column>
            <el-table-column
                width="160"
                label="快照时间"
                prop="createTime">
                <template slot-scope="props">
                    {{ props.row.createTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="UID"
                width="80"
                prop="userCode">
            </el-table-column>
            <el-table-column
                label="钱包地址"
                prop="walletAddr">
            </el-table-column>
            <el-table-column
                v-for="(item, index) in tableData[0].currencyInfos"
                :label="item.currency"
                :key="index">
                <template slot-scope="scope">
                    {{tableData[scope.$index].currencyInfos[index].balance}}
                </template>
            </el-table-column>
        </el-table>
        <div class="notdata" v-else>暂无数据</div>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="currentChange"/>
    </div>
</template>

<script>
    import {accountSnapshot, accountSnapshotTimeQuery} from '@/api/finance/account-snapshot'
    import Pagination from '@/components/Pagination'
    import Cookie from 'js-cookie'

    export default {
        data () {
            return {
                // 分页行数
                pageSize: 10,
                // 当前页
                currentPage: 1,
                // 数据总数
                total: 0,
                // 表格数据，默认数据防止报错
                tableData: [],
                // 日期选中时间
                value: '',
                // 币种信息
                currencyInfo: [],
                // 快照生成时间
                time: ' 00:00:00',
                // 快照查询是否可用
                hasTime: false
            }
        },
        created () {
            this.accountSnapshotTimeQuery()
        },
        methods: {
            /**
             * 查询账户快照生成时间
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
                        this.hasTime = false
                    } else {
                        this.time = ' ' + res.data
                        this.hasTime = true
                        this.getZone()
                        this.currentChange()
                    }
                })
            },
            /**
             *  显示每页条数
             *  @param val 改变后的条数
             * */
            handleSizeChange (val) {
                this.pageSize = val
                this.currentChange()
            },
            /**
             * 初始化日期时间
             */
            getZone () {
                if (parseFloat(Cookie.get('zoneTime')) === 8) {
                    this.value = this.parseTime(new Date().getTime() - 24 * 60 * 60 * 1000, '{y}-{m}-{d}') + this.time
                } else {
                    // 获取用户选择的时间戳，用 + 00:00:00 比较大小
                    let oldTime = new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + ' 00:00:00').getTime()
                    let newTime = new Date(new Date(new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + this.time).getTime() + (parseFloat(Cookie.get('zoneTime')) - 8) * 60 * 60 * 1000).toDateString() + ' 00:00:00').getTime()
                    // 判断处理后的时区与当前时区是否在同一天，如果不是需要同步
                    if (oldTime > newTime) {
                        this.value = new Date(new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + this.time).getTime() + (parseFloat(Cookie.get('zoneTime')) - 8) * 60 * 60 * 1000)
                    } else {
                        this.value = new Date(new Date(this.parseTime(new Date(), '{y}-{m}-{d}') + this.time).getTime() + (parseFloat(Cookie.get('zoneTime')) - 8 - 24) * 60 * 60 * 1000)
                    }
                }
            },
            /**
             * 重置表单
             */
            resetForm () {
                this.getZone()
                this.currentChange()
            },
            /**
             * 分页查询
             */
            currentChange () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        filter: {
                            startTime: this.parseTime(this.value),
                            endTime: this.parseTime(this.value)
                        },
                        pageSize: this.pageSize,
                        pageNum: this.currentPage
                    }
                }
                accountSnapshot(data).then(res => {
                    if (!res.data.list) {
                        this.$message({
                            message: '当前选择日期：暂无数据',
                            type: 'warning'
                        })
                    }
                    this.tableData = res.data.list
                    this.total = parseInt(res.data.total)
                })
            },
            selectDate (date) {
                this.value = this.parseTime(date, '{y}-{m}-{d} {h}:{i}') + ':00'
            },
            /**
             * 导出导出
             */
            checkoutData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: this.parseTime(this.value)
                }
                window.location.href = `/api/v2/user/wallet/account/snapshot/export?traceId=${data.traceId}&day=${data.data}&timeZone=${encodeURIComponent(Cookie.get('GMT'))}`
            }
        },
        components: {Pagination}
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .tools {
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .load-out {
            flex: 1;
            text-align: right;
        }
    }

    .title-desc {
        color: rgba(0, 0, 0, 0.45);
    }

    .picker-shot {
        margin: 0 20px;
    }

    /deep/ .recharge-header-bg {
        background-color: #FAFAFA;
    }

    /deep/ .el-pagination {
        margin: 20px auto;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .item-text {
        margin-right: 50px;
    }

    .notdata {
        font-size: 14px;
        line-height: 60px;
        color: #909399;
        text-align: center;
    }
</style>
