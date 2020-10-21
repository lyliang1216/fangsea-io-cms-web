<template>
    <div class="app-container">
        <el-steps :active="active" finish-status="success" align-center>
            <el-step title="设定损益范围"></el-step>
            <el-step title="数据样本采集"></el-step>
            <el-step title="核查"></el-step>
        </el-steps>
        <div class="components-content">
            <set-range v-if="active === 0" @nextStep="nextStep"></set-range>
            <data-collection v-else-if="active === 1" @nextStep="nextStep" @preStep="preStep"></data-collection>
            <verify v-else @preStep="preStep"></verify>
        </div>
    </div>
</template>

<script>
    import SetRange from '@/views/post-investment/new-dividends/components/SetRange'
    import DataCollection from '@/views/post-investment/new-dividends/components/DataCollection'
    import Verify from '@/views/post-investment/new-dividends/components/Verify'

    export default {
        name: 'index',
        data () {
            return {
                // 步骤条
                active: 0
            }
        },
        methods: {
            /**
             * 下一步
             */
            nextStep () {
                this.active++
            },
            /**
             * 上一步
             */
            preStep () {
                this.active--
            }
        },
        components: {
            SetRange,
            DataCollection,
            Verify
        }
    }
</script>

