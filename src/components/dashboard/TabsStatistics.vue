<template>
    <div>
        <div class="statistics-box" v-if="tabsType===0">
            <div class="statistics-item">
                <p class="item-num">{{saleData.numberOfFirstSubscribers | getMoneyNum}}</p>
                <p class="item-tt">首次认购人数</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{saleData.newUserSubscriptionTimes | getMoneyNum}}</p>
                <p class="item-tt">新用户认购次数</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{saleData.overallNumberOfPeople | getMoneyNum}}</p>
                <p class="item-tt">认购总人数</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{saleData.subscriptionTimes | getMoneyNum}}</p>
                <p class="item-tt">认购次数</p>
            </div>
        </div>
        <div class="statistics-box" v-else-if="tabsType===1">
            <div class="statistics-item">
                <p class="item-num">{{assetsData.numberOfFirstRecharge | getMoneyNum}}</p>
                <p class="item-tt">首次充值人数</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{assetsData.firstTimeRechargeCurrency}}</p>
                <p class="item-tt">首次充值币种</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{assetsData.totalPeople | getMoneyNum}}</p>
                <p class="item-tt">充值总人数</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{assetsData.totalTime | getMoneyNum}}</p>
                <p class="item-tt">充值总人次</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{assetsData.rechargeCurrency}}</p>
                <p class="item-tt">充值币种</p>
            </div>
            <div class="statistics-item">
                <p class="item-num">{{assetsData.rechargeAssets | getMoneyNum}}</p>
                <p class="item-tt">充值资产(USDT)</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {getTabsAssetsBasicsData, getTabsSalesBasicsData} from '@/api/dashboard/index'
    import {getMoneyNum} from '@/utils/filters'

    export default {
        name: 'TabsStatistics',
        props: ['timeRange', 'tabsType'],
        data () {
            return {
                saleData: {
                    numberOfFirstSubscribers: 0,
                    newUserSubscriptionTimes: 0,
                    overallNumberOfPeople: 0,
                    subscriptionTimes: 0
                },
                assetsData: {
                    numberOfFirstRecharge: 0,
                    firstTimeRechargeCurrency: '',
                    totalPeople: 0,
                    totalTime: 0,
                    rechargeCurrency: '',
                    rechargeAssets: 0
                }
            }
        },
        watch: {
            timeRange (val) {
                this.getData()
            }
        },
        mounted () {
            this.getData()
        },
        methods: {
            // 触发数据获取
            getData () {
                if (this.tabsType === 0) {
                    this.getTabsSalesBasicsData()
                } else {
                    this.getTabsAssetsBasicsData()
                }
            },
            // 获取销售额tab基础统计数据
            getTabsSalesBasicsData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1]
                    }
                }
                getTabsSalesBasicsData(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.saleData = res.data
                    }
                })
            },
            // 获取资产充值tab基础统计数据
            getTabsAssetsBasicsData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1]
                    }
                }
                getTabsAssetsBasicsData(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.assetsData = res.data
                    }
                })
            }
        },
        filters: {
            getMoneyNum
        }
    }
</script>

<style scoped lang="scss">
    .statistics-box {
        padding: 20px 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .statistics-item {
            text-align: center;
            .item-num {
                font-size: 20px;
                font-weight: bold;
                color: #333333;
            }
            .item-tt {
                font-size: 16px;
                color: #666666;
            }
        }
    }
</style>
