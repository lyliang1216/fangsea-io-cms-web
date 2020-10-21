<template>
    <div class="ranking-box">
        <p class="ranking-title">{{`${tabsType===0?'项目销售额排名':'资产充值额排名'}`}}</p>
        <div class="ranking-list">
            <div class="list-item" v-if="tabsType===0" v-for="(item, index) in saleRankingData">
                <span class="item-num">{{index+1}}</span>
                <span class="item-project">{{item.currency}}</span>
                <span class="item-amount">{{item.total | getMoneyNum}}</span>
            </div>
            <div class="list-item" v-if="tabsType===0" v-for="(item, index) in saleRankingData">
                <span class="item-num">{{index+1}}</span>
                <span class="item-project">{{item.currency}}</span>
                <span class="item-amount">{{item.total | getMoneyNum}}</span>
            </div>
            <div class="list-item" v-if="tabsType===0" v-for="(item, index) in saleRankingData">
                <span class="item-num">{{index+1}}</span>
                <span class="item-project">{{item.currency}}</span>
                <span class="item-amount">{{item.total | getMoneyNum}}</span>
            </div>
            <div class="list-item" v-if="tabsType===1" v-for="(item, index) in assetRankingData">
                <span class="item-num">{{index+1}}</span>
                <span class="item-project">{{item.currency}}</span>
                <span class="item-amount">{{item.total | getMoneyNum}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {getSalesLeaderboardData, getTabsAssetRechargeData} from '@/api/dashboard/index'
    import {getMoneyNum} from '@/utils/filters'

    export default {
        name: 'RankingList',
        props: ['timeRange', 'tabsType'],
        data () {
            return {
                saleRankingData: [],
                assetRankingData: []
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
                    this.getSalesLeaderboardData()
                } else {
                    this.getTabsAssetRechargeData()
                }
            },
            // 获取销售排行
            getSalesLeaderboardData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1]
                    }
                }
                getSalesLeaderboardData(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.saleRankingData = res.data
                    }
                })
            },
            // 获取充值排行
            getTabsAssetRechargeData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1]
                    }
                }
                getTabsAssetRechargeData(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.assetRankingData = res.data
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
    .ranking-box {
        .ranking-title {
            font-size: 16px;
        }
        .ranking-list {
            .list-item {
                width: 100%;
                padding: 8px 0;
                &:nth-child(1) {
                    .item-num {
                        background-color: #f54545;
                        color: #ffffff;
                    }
                }
                &:nth-child(2) {
                    .item-num {
                        background-color: #ff8547;
                        color: #ffffff;
                    }
                }
                &:nth-child(3) {
                    .item-num {
                        background-color: #ffac38;
                        color: #ffffff;
                    }
                }
                .item-num {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: #8eb9f5;
                    overflow: hidden;
                    line-height: 20px;
                    text-align: center;
                    color: #ffffff;
                    vertical-align: middle;
                    font-size: 14px;
                }
                .item-project {
                    display: inline-block;
                    width: calc(50% - 20px);
                    color: #666666;
                    padding-left: 15px;
                    vertical-align: middle;
                }
                .item-amount {
                    display: inline-block;
                    text-align: right;
                    color: #333333;
                    width: 45%;
                    vertical-align: middle;
                }
                &:nth-child(n+9) {
                    display: none;
                }
            }
        }
    }
</style>
