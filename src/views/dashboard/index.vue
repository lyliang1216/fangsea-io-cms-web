<template>
    <div class="dashboard-container">
        <!--<div class="year-total">-->
        <!--<sales-total :yearData="yearTotal.annualTotalSales"></sales-total>-->
        <!--<RechargeTotal :yearData="yearTotal.totalAnnualRecharge"></RechargeTotal>-->
        <!--<ReleaseOrder :yearData="yearTotal.numberOfAnnualSubscriptionOrders"></ReleaseOrder>-->
        <!--<KycPassingRate :yearData="yearTotal.kycCompletionRate"></KycPassingRate>-->
        <!--</div>-->
        <!--<time-tabs>-->
        <!--<template slot="salesPage" slot-scope="prop">-->
        <!--<tabs-statistics :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType"/>-->
        <!--<div class="trend-box">-->
        <!--<trend-map class="trend-map" :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType" />-->
        <!--<ranking-list class="ranking-box" :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType" />-->
        <!--</div>-->
        <!--<div class="list-bottom">-->
        <!--<project-subscription-order :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType"/>-->
        <!--<pie-chart :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType"/>-->
        <!--</div>-->
        <!--</template>-->
        <!--<template slot="rechargePage" slot-scope="prop">-->
        <!--<tabs-statistics :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType"/>-->
        <!--<div class="trend-box">-->
        <!--<trend-map class="trend-map" :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType" />-->
        <!--<ranking-list class="ranking-box" :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType" />-->
        <!--</div>-->
        <!--<div class="list-bottom">-->
        <!--<project-subscription-order :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType"/>-->
        <!--<pie-chart :startTime="prop.startTime" :endTime="prop.endTime" :tabsType="prop.tabsType"/>-->
        <!--</div>-->
        <!--</template>-->
        <!--</time-tabs>-->
    </div>
</template>

<script>
    import ProjectSubscriptionOrder from '@/components/dashboard/ProjectSubscriptionOrder'
    import KycPassingRate from '@/components/dashboard/year-total/KycPassingRate'
    import RechargeTotal from '@/components/dashboard/year-total/RechargeTotal'
    import ReleaseOrder from '@/components/dashboard/year-total/ReleaseOrder'
    import SalesTotal from '@/components/dashboard/year-total/SalesTotal'
    import TabsStatistics from '@/components/dashboard/TabsStatistics'
    import RankingList from '@/components/dashboard/RankingList'
    import TrendMap from '@/components/dashboard/TrendMap'
    import PieChart from '@/components/dashboard/PieChart'
    import TimeTabs from '@/components/dashboard/TimeTabs'
    import {getYearTotalData} from '@/api/dashboard/index'

    export default {
        name: 'Dashboard',
        data () {
            return {
                yearTotal: {
                    // 年度销售额
                    annualTotalSales: {
                        // 年度销售总额
                        annualTotalSales: 0,
                        // 周环比
                        weekToweekRatio: 0,
                        // 月环比
                        monthToMonthRatio: 0,
                        // 日均销售额
                        dailyAverageSales: 0
                    },
                    // 年度充值总额
                    totalAnnualRecharge: {
                        // 年度充值总额
                        totalAnnualRecharge: 0,
                        // 折线图数据
                        lineChart: '',
                        // 周充值量
                        totalAmountOfWeeklyRecharge: 0
                    },
                    // 年度认购笔数
                    numberOfAnnualSubscriptionOrders: {
                        // 年度认购笔数
                        numberOfAnnualSubscriptionOrders: 0,
                        // 柱状图数据
                        histogram: '',
                        // 预购成功率
                        missionSuccessRate: 0
                    },
                    // 年度KYC完成率
                    kycCompletionRate: {
                        // 年度kyc完成率
                        kYCCompletionRate: 0,
                        // 周环比
                        weekToweekRatio: 0,
                        // 月环比
                        monthToMonthRatio: 0,
                        // 比例
                        proportion: 0
                    }
                }
            }
        },
        created () {
            // this.getYearTotal()
        },
        methods: {
            getYearTotal () {
                let data = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getYearTotalData(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.yearTotal = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        },
        components: {
            RankingList,
            TrendMap,
            TabsStatistics,
            ProjectSubscriptionOrder,
            SalesTotal,
            RechargeTotal,
            ReleaseOrder,
            KycPassingRate,
            PieChart,
            TimeTabs
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .dashboard {
        &-container {
            margin: 30px;
            min-width: 1200px;
            overflow: auto;
        }
        &-text {
            font-size: 30px;
            line-height: 46px;
        }
    }

    .year-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div {
            width: 22%;
            overflow: hidden;
        }
    }

    .trend-box {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 30px;
        .trend-map {
            width: 65%;
            overflow: hidden;
        }
        .ranking-box {
            width: 34%;
            overflow: hidden;
        }
    }

    .list-bottom {
        display: flex;
        justify-content: space-between;
        align-items: start;
        & > div {
            width: 48%;
            overflow: hidden;
        }
    }
</style>
