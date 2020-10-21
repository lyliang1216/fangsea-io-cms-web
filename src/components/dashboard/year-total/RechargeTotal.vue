<template>
    <div>
        <div class="title">
            <span>年度充值总额</span>
            <el-tooltip class="item" effect="light" placement="bottom">
                <div slot="content">
                    新加坡 GMT+8 自然年度投资人充值总额，非USDT币种支付按最新<br/>
                    汇率估算，只包含投资人的充值，不含项目发行、分红等充值。
                </div>
                <i class="el-icon-info-outline"></i>
                <img src="@/assets/info.png" alt="">
            </el-tooltip>
        </div>
        <h3>{{yearData.totalAnnualRecharge | getMoneyNum}}<span> USDT</span></h3>
        <div class="content">
            <div id="rechargeChart"></div>
        </div>
        <div class="total-footer">
            <p>周充值总量 {{yearData.totalAmountOfWeeklyRecharge | getMoneyNum}} USDT</p>
        </div>
    </div>
</template>

<script>
    import {getMoneyNum} from '@/utils/filters'

    export default {
        props: ['yearData'],
        data () {
            return {
                // x轴时间
                xTime: [],
                // y轴数据
                yTotal: []
            }
        },
        watch: {
            yearData () {
                this.initData()
                this.initChart()
            }
        },
        mounted () {
            this.initData()
            this.initChart()
        },
        methods: {
            // 初始化数据
            initData () {
                if (this.yearData.lineChart.length !== 0) {
                    this.yearData.lineChart.map(item => {
                        this.xTime.push(item.name)
                        this.yTotal.push(item.value)
                    })
                }
            },
            // 初始化图表
            initChart () {
                let rechargeChart = this.$echarts.init(document.getElementById('rechargeChart'))
                rechargeChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        }
                    },
                    grid: {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xTime,
                        show: false
                    },
                    yAxis: {
                        type: 'value',
                        show: false
                    },
                    series: [{
                        data: this.yTotal,
                        type: 'line',
                        symbol: 'none',
                        areaStyle: {
                            normal: {
                                color: '#8543E0'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#8543E0',
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 0)'
                                }
                            }
                        }
                    }]
                })
                window.onresize = () => {
                    rechargeChart.resize()
                }
            }
        },
        filters: {
            getMoneyNum
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        font-size: 16px;
        color: #999;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h3 {
        font-weight: normal;
        color: #333;
        font-size: 32px;
        line-height: 2;
        margin: 0;
        span {
            font-size: 16px;
        }
    }

    .content {
        height: 40px;
        display: flex;
        align-items: center;
        #rechargeChart {
            width: 100%;
            height: 100%;
        }
    }

    .total-footer {
        border-top: 1px solid #cecece;
        margin-top: 10px;
        padding: 10px 0;
        p {
            margin: 0;
        }
    }
</style>
