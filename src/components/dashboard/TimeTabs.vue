<template>
    <div class="tabs-box">
        <div class="tabs-dates">
            <div class="date-options">
                <span class="options-item" @click="chooseDateOptions(0)" :class="activeDate===0?'active':''">今日</span>
                <span class="options-item" @click="chooseDateOptions(1)" :class="activeDate===1?'active':''">本周</span>
                <span class="options-item" @click="chooseDateOptions(2)" :class="activeDate===2?'active':''">本月</span>
                <span class="options-item" @click="chooseDateOptions(3)" :class="activeDate===3?'active':''">全年</span>
            </div>
            <el-date-picker
                v-model="date"
                class="tabs-datepick"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="changeDate"
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="销售额" name="sales">
                <slot v-if="activeName==='sales'" name="salesPage" :timeRange="date" :tabsType="0"></slot>
            </el-tab-pane>
            <el-tab-pane label="资产充值" name="recharge">
                <slot v-if="activeName==='recharge'" name="rechargePage" :timeRange="date" :tabsType="1"></slot>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                // 当前图表类型
                activeName: 'sales',
                // 时间
                date: [],
                // 时间选择
                activeDate: 1
            }
        },
        created () {
            this.chooseDateOptions(this.activeDate)
        },
        methods: {
            // 切换tabs
            handleClick (tab, event) {
                this.chooseDateOptions(1)
            },
            changeDate () {
                this.activeDate = ''
            },
            // 快捷切换时间范围
            chooseDateOptions (itemId) {
                this.activeDate = itemId
                this.date = []
                switch (itemId) {
                // 今日
                case 0:
                    this.date = [
                        this.getZoneTime(Date.parse(new Date()) / 1000).substring(0, 10) + ' 00:00:00',
                        this.getZoneTime(Date.parse(new Date()) / 1000)
                    ]
                    break
                    // 本周
                case 1:
                    this.currentWeek()
                    break
                    // 本月
                case 2:
                    this.date = [
                        this.getZoneTime(Date.parse(new Date()) / 1000).substring(0, 7) + '-1 00:00:00',
                        this.getZoneTime(Date.parse(new Date()) / 1000)
                    ]
                    break
                    // 全年
                case 3:
                    this.date = [
                        this.getZoneTime(Date.parse(new Date()) / 1000).substring(0, 4) + '-1-1 00:00:00',
                        this.getZoneTime(Date.parse(new Date()) / 1000)
                    ]
                    break
                }
            },
            // 当前星期
            currentWeek () {
                let nowDateTemp = Date.parse(new Date())
                let nowDate = this.getZoneTime(nowDateTemp / 1000)
                let nowWeek = new Date(this.getZoneTime(nowDateTemp / 1000)).getDay()
                let mondayDate = 0
                if (nowWeek === 0) {
                    mondayDate = nowDateTemp - 6 * 24 * 3600 * 1000
                } else {
                    mondayDate = nowDateTemp - (nowWeek - 1) * 24 * 3600 * 1000
                }
                let nowWeekDate = this.getZoneTime(mondayDate / 1000).substring(0, 10)
                this.date = [nowWeekDate + ' 00:00:00', nowDate]
            }
        }
    }
</script>

<style scoped lang="scss">
    .tabs-box {
        min-width: 1200px;
        position: relative;
        margin-top: 30px;
        .tabs-dates {
            position: absolute;
            right: 20px;
            top: 0;
            z-index: 9;
            .date-options {
                font-size: 14px;
                color: #666666;
                margin-top: 3px;
                float: left;
                margin-right: 40px;
                .options-item {
                    display: inline-block;
                    height: 34px;
                    line-height: 34px;
                    padding: 0 15px;
                    cursor: pointer;
                    &.active {
                        color: #2EA9DF;
                    }
                }
            }
            .tabs-datepick {
                height: 34px;
                line-height: 34px;
                /deep/ .el-input__inner {
                    height: 34px !important;
                    line-height: 34px !important;
                    margin-top: 3px;
                }
                /deep/ .el-input__icon {
                    line-height: 26px;
                }
                /deep/ .el-range-separator {
                    line-height: 26px;
                }
            }
        }
    }
</style>
<style>
    .el-time-panel {
        left: auto !important;
        right: 0 !important;
    }
</style>
