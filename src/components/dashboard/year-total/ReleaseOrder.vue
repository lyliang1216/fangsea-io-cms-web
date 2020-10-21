<template>
    <div>
        <div class="title">
            <span>年度认购订单笔数</span>
            <el-tooltip class="item" effect="light" placement="bottom">
                <div slot="content">
                    新加坡 GMT+8 自然年度投资人认购订单笔数，包含状态为<br/>
                    未发行、预售中、预售失败、预售完成、已发行的项目订单。
                </div>
                <i class="el-icon-info-outline"></i>
                <img src="@/assets/info.png" alt="">
            </el-tooltip>
        </div>
        <h3>{{yearData.numberOfAnnualSubscriptionOrders | getMoneyNum}}<span> USDT</span></h3>
        <div class="content">
            <div id="orderChart"></div>
        </div>
        <div class="total-footer">
            <p>预售成功率 {{yearData.missionSuccessRate | getCurLeng(1)}}%</p>
        </div>
    </div>
</template>

<script>
    import {getMoneyNum, getCurLeng} from '@/utils/filters'

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
                if (this.yearData.histogram.length !== 0) {
                    this.yearData.histogram.map(item => {
                        this.xTime.push(item.name)
                        this.yTotal.push(item.value)
                    })
                }
            },
            // 初始化图表
            initChart () {
                let orderChart = this.$echarts.init(document.getElementById('orderChart'))
                orderChart.setOption({
                    color: ['#33ABFB'],
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
                        top: 0,
                        containLabel: false
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.xTime,
                            show: false,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            show: false
                        }
                    ],
                    series: [
                        {
                            name: '直接访问',
                            type: 'bar',
                            barWidth: '60%',
                            data: this.yTotal
                        }
                    ]
                })
                window.onresize = () => {
                    orderChart.resize()
                }
            }
        },
        filters: {
            getMoneyNum,
            getCurLeng
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
        #orderChart {
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
