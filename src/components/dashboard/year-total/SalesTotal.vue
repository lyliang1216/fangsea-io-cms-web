<template>
    <div class="dashboard-">
        <div class="title">
            <span>年度总销售额</span>
            <el-tooltip class="item" effect="light" placement="bottom">
                <div slot="content">
                    新加坡 GMT+8 自然年度销售总额，非USDT币种支付按最新汇率估算，<br/>
                    包含状态为未发行、预售中、预售失败、预售完成、已发行的项目订单。
                </div>
                <i class="el-icon-info-outline"></i>
                <img src="@/assets/info.png" alt="">
            </el-tooltip>
        </div>
        <h3>{{yearData.annualTotalSales | getMoneyNum}}<span> USDT</span></h3>
        <div class="content">
            <div class="ratio">
                <p>周环比<span><i :class="yearData.weekToweekRatio > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>{{Math.abs(yearData.weekToweekRatio)}}%</span>
                </p>
                <p>月环比<span><i
                    :class="yearData.monthToMonthRatio > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>{{Math.abs(yearData.monthToMonthRatio)}}%</span>
                </p>
            </div>
        </div>
        <div class="total-footer">
            <p>日均销售额 {{yearData.dailyAverageSales | getMoneyNum}} USDT</p>
        </div>
    </div>
</template>

<script>
    import {getMoneyNum} from '@/utils/filters'

    export default {
        props: ['yearData'],
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
    }

    .ratio {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        p {
            margin: 0;
        }
        .el-icon-caret-top {
            color: #52C41A;
            margin-left: 10px;
        }
        .el-icon-caret-bottom {
            color: #F5222D;
            margin-left: 10px;
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
