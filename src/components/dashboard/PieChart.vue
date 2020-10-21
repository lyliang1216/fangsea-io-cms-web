<template>
    <div>
        <div v-if="tabsType === 0" >
            <span>项目销售额占比</span>
            <el-divider/>
            <div id="salesVolume" class="pie"></div>
        </div>
        <div v-else>
            <span>充值币种类别占比</span>
            <el-divider/>
            <div id="recharge" class="pie"></div>
        </div>
    </div>
</template>

<script>
    import { getTabsProjectSalesData, getTabsRechargeAnalogyData } from '@/api/dashboard/index'
    import Pagination from '@/components/Pagination'
    import { getMoneyNum } from '@/utils/filters'

    export default {
        name: 'ProjectSubscriptionOrder',
        props: ['timeRange', 'tabsType'],
        data () {
            return {
                // 拼图数据
                pieChart: [],
                // 拼图legend数据
                proportionOfSales: [],
                // 饼图自定义的颜色
                colors: [
                    '#3AA1FF',
                    '#36CBCB',
                    '#4ECB73',
                    '#FBD437',
                    '#F2637B',
                    '#975FE5',
                    '#F2637B',
                    '#975FE4'
                ]
            }
        },
        mounted () {
            this.checkTabsType()
        },
        watch: {
            timeRange (val) {
                this.checkTabsType()
            },
            tabsType (val) {
                this.checkTabsType()
            }
        },
        methods: {
            // 判断类型查询数据
            checkTabsType () {
                if (this.tabsType === 0) {
                    this.getTabsProjectSalesData()
                } else {
                    this.getTabsRechargeAnalogyData()
                }
            },
            // 获取项目认购订单
            getTabsProjectSalesData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1]
                    }
                }
                getTabsProjectSalesData(data).then(response => {
                    if (response.code.toString() === '0') {
                        this.pieChart = response.data[1].pieChart
                        this.proportionOfSales = response.data[0].proportionOfSales
                        // 初始化echart对象
                        let salesVolume = this.$echarts.init(document.getElementById('salesVolume'))
                        // 项目名字集合
                        let names = []
                        // 名字颜色
                        let colors = this.colors.splice(names.length)
                        this.pieChart.forEach((item, index) => {
                            names.push(item.name)
                        })
                        salesVolume.setOption({
                            title: {
                                text: '销售额',
                                textStyle: {
                                    color: '#787878',
                                    fontSize: 16
                                }
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                                top: '15%',
                                left: '60%',
                                itemGap: 25,
                                itemHeight: 10,
                                itemWidth: 10,
                                formatter: function (name) {
                                    // 自定义图例
                                    let legend = ''
                                    this.proportionOfSales.forEach((item, index) => {
                                        if (name === item.currency) {
                                            let total = getMoneyNum(item.total)
                                            legend = `${item.currency}   |   ${item.proportion}%     ${total}`
                                        }
                                    })
                                    return legend
                                },
                                textStyle: {
                                    fontSize: 14,
                                    padding: [2, 0, 0, 6]
                                },
                                icon: 'circle',
                                orient: 'vertical',
                                data: names
                            },
                            color: colors,
                            series: [
                                {
                                    name: '销售额(USDT)',
                                    type: 'pie',
                                    radius: ['50%', '68%'],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            borderWidth: 3,
                                            borderColor: '#fff'
                                        }
                                    },
                                    center: ['30%', '50%'],
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: this.pieChart
                                }
                            ]
                        }, true)
                        window.onresize = function () {
                            salesVolume.resize()
                        }
                    } else {
                        this.$message.error(response.msg)
                    }
                })
            },
            // 获取项目认购订单
            getTabsRechargeAnalogyData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.startTime,
                        endTime: this.endTime
                    }
                }
                getTabsRechargeAnalogyData(data).then(response => {
                    if (response.code.toString() === '0') {
                        // 初始化echart对象
                        this.pieChart = response.data[1].pieChart
                        this.proportionOfSales = response.data[0].proportionOfSales
                        // 项目名字集合
                        let names = []
                        // 名字颜色
                        let colors = this.colors.splice(names.length)
                        this.pieChart.forEach((item, index) => {
                            names.push(item.name)
                        })
                        let recharge = this.$echarts.init(document.getElementById('recharge'))
                        recharge.setOption({
                            title: {
                                text: '充值资产估值',
                                textStyle: {
                                    color: '#787878',
                                    fontSize: 16
                                }
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b}: {c} ({d}%)'
                            },
                            legend: {
                                top: '15%',
                                left: '60%',
                                itemGap: 25,
                                itemHeight: 10,
                                itemWidth: 10,
                                formatter: function (name) {
                                    // 自定义图例
                                    let legend = ''
                                    this.proportionOfSales.forEach((item, index) => {
                                        if (name === item.currency) {
                                            let total = getMoneyNum(item.total)
                                            legend = `${item.currency}   |   ${item.proportion}%     ${total}`
                                        }
                                    })
                                    return legend
                                },
                                textStyle: {
                                    fontSize: 14,
                                    padding: [2, 0, 0, 6]
                                },
                                icon: 'circle',
                                orient: 'vertical',
                                data: names
                            },
                            color: colors,
                            series: [
                                {
                                    name: '资产估值(USDT)',
                                    type: 'pie',
                                    radius: ['50%', '68%'],
                                    avoidLabelOverlap: false,
                                    itemStyle: {
                                        normal: {
                                            borderWidth: 3,
                                            borderColor: '#fff'
                                        }
                                    },
                                    center: ['30%', '50%'],
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: this.pieChart
                                }
                            ]
                        }, true)
                        window.onresize = function () {
                            recharge.resize()
                        }
                    } else {
                        this.$message.error(response.msg)
                    }
                })
            }
        },
        components: {
            Pagination
        }
    }
</script>

<style scoped>
    .pie {
        height: 400px;
        width: 100%;
    }
</style>
