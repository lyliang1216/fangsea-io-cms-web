<template>
    <div class="map-box">
        <p class="map-title">{{`${tabsType===0?'销售额趋势图':'资产趋势图'}`}}</p>
        <div id="saleTrendMap" class="trendMap" v-if="tabsType===0"></div>
        <div id="assetsTrendMap" class="trendMap" v-if="tabsType===1"></div>
        <p class="map-title">
            <span>{{`${tabsType===0?'销售额趋势图':'资产趋势图'}`}}</span>
            <svg-icon icon-class="barchart" @click="changeMapType('bar')" class="map-icon"
                      :class="mapType==='bar'?'active':''"/>
            <svg-icon icon-class="linechart" @click="changeMapType('line')" class="map-icon"
                      :class="mapType==='line'?'active':''"/>
        </p>
    </div>
</template>

<script>
    import {getSaleTrendMapData, getAssetsTrendMapData} from '@/api/dashboard/index'

    export default {
        name: 'TrendMap',
        props: ['timeRange', 'tabsType'],
        data () {
            return {
                mapType: 'bar',
                saleTrendMapData: {},
                assetsTrendMapData: {}
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
                    this.getSaleMapData()
                } else {
                    this.getAssetsMapData()
                }
            },
            // 获取销售额图表数据
            getSaleMapData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1],
                        type: this.mapType === 'bar' ? '2' : '1'
                    }
                }
                getSaleTrendMapData(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.assetsTrendMapData = res.data
                        let xTime = []
                        let yTotal = []
                        res.data.map(item => {
                            xTime.push(item.name)
                            yTotal.push(item.value)
                        })
                        let trendMap = this.$echarts.init(document.getElementById('saleTrendMap'))
                        trendMap.setOption({
                            color: ['#33ABFB'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                }
                            },
                            grid: {
                                left: '6%',
                                right: '4%',
                                bottom: '8%',
                                top: '2%'
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: xTime,
                                    show: true,
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    show: true
                                }
                            ],
                            series: [
                                {
                                    name: '销售额',
                                    type: this.mapType,
                                    barWidth: '60%',
                                    data: yTotal
                                }
                            ]
                        }, true)
                        window.onresize = function () {
                            trendMap.resize()
                        }
                    }
                })
            },
            // 获取资产图表数据
            getAssetsMapData () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        startTime: this.timeRange[0],
                        endTime: this.timeRange[1],
                        type: this.mapType === 'bar' ? '2' : '1'
                    }
                }
                getAssetsTrendMapData(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.saleTrendMapData = res.data
                        let xTime = []
                        let yTotal = []
                        res.data.map(item => {
                            xTime.push(item.name)
                            yTotal.push(item.value)
                        })
                        let trendMap = this.$echarts.init(document.getElementById('assetsTrendMap'))
                        trendMap.setOption({
                            color: ['#33ABFB'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'line'
                                }
                            },
                            grid: {
                                left: '2%',
                                right: '4%',
                                bottom: '2%',
                                top: '2%'
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: xTime,
                                    show: true,
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    show: true
                                }
                            ],
                            series: [
                                {
                                    name: '销售额',
                                    type: this.mapType,
                                    barWidth: '60%',
                                    data: yTotal
                                }
                            ]
                        }, true)
                        window.onresize = function () {
                            trendMap.resize()
                        }
                    }
                })
            },
            // 切换图表类型
            changeMapType (type) {
                this.mapType = type
                this.getData()
            }
        }
    }
</script>

<style scoped lang="scss">
    .trendMap {
        width: 100%;
        height: 350px;
    }

    .map-title {
        margin-top: 15px;
        text-align: center;
        .map-icon {
            margin-left: 8px;
            cursor: pointer;
            &.active {
                color: #2EA9DF;
            }
        }
    }
</style>
