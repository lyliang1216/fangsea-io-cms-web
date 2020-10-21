<template>
    <div class="container">
        <div class="part">
            <p>损益范围</p>
            <div>
                <p>损益类别：{{detailsData.profitType}}</p>
                <p>分红类型：{{detailsData.bonusType}}</p>
                <p>时间范围：{{detailsData.startTime | getZoneTime}} 至 {{detailsData.endTime | getZoneTime}}</p>
                <p class="last">资产范围：{{detailsData.tickers | ptProjectList}}</p>
            </div>
        </div>
        <div class="part">
            <p>样本数据</p>
            <div>
                <p>THB/USDT：{{detailsData.curRate}}</p>
            </div>
        </div>
        <div>
            <p>损益数据</p>
            <div class="tables-box">
                <a href="javascript:;" class="download-table" v-auth="{id: 10300010004}" @click="downloadTable">完整导出</a>
                <el-tabs v-model="tableIndex">
                    <el-tab-pane label="单份PT分红" name="1">
                        <single-PT v-if="tableIndex === '1'"></single-PT>
                    </el-tab-pane>
                    <el-tab-pane label="链上快照" name="2">
                        <chain-snapshot v-if="tableIndex === '2'"></chain-snapshot>
                    </el-tab-pane>
                    <el-tab-pane label="PTEx损益" name="3">
                        <PTEX-profit-loss v-if="tableIndex === '3'"></PTEX-profit-loss>
                    </el-tab-pane>
                    <el-tab-pane label="PTOHome损益" name="4">
                        <PTO-profit-loss v-if="tableIndex === '4'"></PTO-profit-loss>
                    </el-tab-pane>
                    <el-tab-pane label="PTEx快照" name="5">
                        <PTEX-snapshot v-if="tableIndex === '5'"></PTEX-snapshot>
                    </el-tab-pane>
                    <el-tab-pane label="PTOHome快照" name="6">
                        <PTO-snapshot v-if="tableIndex === '6'"></PTO-snapshot>
                    </el-tab-pane>
                    <el-tab-pane label="分红结算" name="7">
                        <dividend-settle v-if="tableIndex === '7'"></dividend-settle>
                    </el-tab-pane>
                    <el-tab-pane label="错误信息" name="8" v-if="errorTotal > 0">
                        <error-message v-if="tableIndex === '8'"></error-message>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="footer-btn" v-if="!isshowBtn">
            <el-button size="small" type="primary" @click="submitFinance" :disabled="disabled" v-if="!details">
                提交财务审核结算
            </el-button>
            <el-button size="small" @click="preStep">上一步</el-button>
            <el-button size="small" @click="returnList">返回列表</el-button>
        </div>
    </div>
</template>

<script>
    import DividendSettle from '@/views/post-investment/new-dividends/components/tableComponents/DividendSettle'
    import PTEXProfitLoss from '@/views/post-investment/new-dividends/components/tableComponents/PTEXProfitLoss'
    import ChainSnapshot from '@/views/post-investment/new-dividends/components/tableComponents/ChainSnapshot'
    import PTOProfitLoss from '@/views/post-investment/new-dividends/components/tableComponents/PTOProfitLoss'
    import PTEXSnapshot from '@/views/post-investment/new-dividends/components/tableComponents/PTEXSnapshot'
    import ErrorMessage from '@/views/post-investment/new-dividends/components/tableComponents/ErrorMessage'
    import PTOSnapshot from '@/views/post-investment/new-dividends/components/tableComponents/PTOSnapshot'
    import SinglePT from '@/views/post-investment/new-dividends/components/tableComponents/SinglePT'
    import {searchDetails, submitFinanceSettle, getErrorMessage} from '@/api/post-investment/new-dividends'
    import Cookie from 'js-cookie'

    export default {
        name: 'Verify',
        props: ['isshowBtn'],
        data () {
            return {
                // 表格索引
                tableIndex: '1',
                // 详情数据
                detailsData: {
                    profitType: '',
                    bonusType: '',
                    startTime: '',
                    endTime: '',
                    tickers: [],
                    curRate: '',
                    curRateTime: ''
                },
                // 是否是查看详情 1详情0其他
                details: this.$route.query.details,
                // 提交按钮是否可用
                disabled: false,
                // 错误信息总数
                errorTotal: 0
            }
        },
        created () {
            // 根据id查详情
            this.searchData()
            // 查询是否存在错误信息
            this.getErrorData()
        },
        methods: {
            /**
             * 根据id查详情
             */
            searchData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: this.$route.query.profitId
                    }
                }
                searchDetails(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.detailsData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 提交财务审核
             */
            submitFinance () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        profitId: this.$route.query.profitId
                    }
                }
                submitFinanceSettle(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.disabled = true
                        this.$message.success('提交成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 上一步
             */
            preStep () {
                this.$emit('preStep')
            },
            /**
             * 返回列表
             */
            returnList () {
                this.$router.push({path: '/postinvestment/profitloss'})
            },
            /**
             * 完整导出表格
             */
            downloadTable () {
                window.location.href = `/api/v2/cms/profit/data/export?id=${this.$route.query.profitId}&timeZone=${encodeURIComponent(Cookie.get('GMT'))}`
            },
            /**
             * 判断是否有错误信息
             */
            getErrorData () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.page,
                        pageSize: this.limit,
                        filter: this.$route.query.profitId.toString()
                    }
                }
                getErrorMessage(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.errorTotal = res.data.total
                    }
                })
            }
        },
        components: {
            DividendSettle,
            PTEXProfitLoss,
            PTOProfitLoss,
            ChainSnapshot,
            PTEXSnapshot,
            ErrorMessage,
            PTOSnapshot,
            SinglePT
        },
        filters: {
            ptProjectList (arr) {
                let str = ''
                arr.map((item) => {
                    str += `${item.projectNumber}(${item.ptCurCode});`
                })
                return str.substring(0, str.length - 1)
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .container {
        padding: 0 20px;
        .part {
            margin-bottom: 30px;
            p {
                margin: 10px 0;
            }
            div {
                padding: 0 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                .last {
                    width: 100%;
                }
            }
            &:nth-child(2) {
                div {
                    justify-content: flex-start;
                    p {
                        width: 33%;
                    }
                }
            }
        }
        .tables-box {
            padding: 0 15px;
            position: relative;
            .download-table {
                position: absolute;
                right: 15px;
                top: 0;
                cursor: pointer;
                z-index: 999;
                font-size: 16px;
                line-height: 40px;
                color: #2EA9DF;
            }
        }
        .footer-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
            .el-button + .el-button {
                margin-left: 20px;
            }
        }
    }
</style>
