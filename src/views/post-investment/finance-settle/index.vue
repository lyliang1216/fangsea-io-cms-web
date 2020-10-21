<template>
    <div class="app-container">
        <verify :isshowBtn="isshowBtn"></verify>
        <div class="footer-btn">
            <el-button size="small" type="primary" :disabled="settleDisabled" @click="settleBtn">结&emsp;算</el-button>
            <el-button size="small" type="danger" :disabled="turnDownDisabled" @click="turnDown">驳&emsp;回</el-button>
            <el-button size="small" @click="returnList">退出结算（返回列表）</el-button>
        </div>
    </div>
</template>

<script>
    import {settlementReq, turnDownReq} from '@/api/post-investment/finance-settle'
    import Verify from '@/views/post-investment/new-dividends/components/Verify'

    export default {
        data () {
            return {
                // 不显示组件底部按钮
                isshowBtn: true,
                // 结算按钮可用
                settleDisabled: false,
                // 驳回按钮可用
                turnDownDisabled: false
            }
        },
        methods: {
            /**
             * 结算
             */
            settleBtn () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: this.$route.query.profitId
                    }
                }
                settlementReq(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.settleDisabled = true
                        this.turnDownDisabled = true
                        this.$message.success('结算成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 驳回
             */
            turnDown () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        profitId: this.$route.query.profitId
                    }
                }
                turnDownReq(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.settleDisabled = true
                        this.turnDownDisabled = true
                        this.$message.success('驳回成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 返回列表
             */
            returnList () {
                this.$router.push({path: '/postinvestment/profitloss'})
            }
        },
        components: {
            Verify
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .footer-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        .el-button + .el-button {
            margin-left: 20px;
        }
    }
</style>
