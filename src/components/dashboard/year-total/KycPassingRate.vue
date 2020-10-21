<template>
    <div class="dashboard-">
        <div class="title">
            <span>年度KYC完成率</span>
            <el-tooltip class="item" effect="light" placement="bottom">
                <div slot="content">
                    新加坡 GMT+8 自然年度新注册的投资人完成KYC的比率。
                </div>
                <i class="el-icon-info-outline"></i>
                <img src="@/assets/info.png" alt="">
            </el-tooltip>
        </div>
        <h3>{{yearData.kYCCompletionRate | getCurLeng(1)}}%</h3>
        <div class="content">
            <el-progress class="kyc-progress" :text-inside="true" color="#13C2C2" :stroke-width="12"
                         :percentage="yearData.kYCCompletionRate"></el-progress>
        </div>
        <div class="total-footer">
            <div class="ratio">
                <p>周环比<span><i
                    :class="yearData.numberOfAnnualSubscriptionOrders > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>{{Math.abs(yearData.weekToweekRatio)}}%</span>
                </p>
                <p>月环比<span><i
                    :class="yearData.numberOfAnnualSubscriptionOrders > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>{{Math.abs(yearData.monthToMonthRatio)}}%</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {getMoneyNum, getCurLeng} from '@/utils/filters'

    export default {
        props: ['yearData'],
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
    }

    .ratio {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

    .kyc-progress {
        width: 100%;
        /deep/ .el-progress-bar__innerText {
            display: none;
        }
    }
</style>
