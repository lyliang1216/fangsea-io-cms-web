<template>
    <div id="app" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <router-view/>
    </div>
</template>

<script>
    import store from '@/store'

    export default {
        name: 'App',
        computed: {
            loading () {
                return store.getters.loading
            }
        }
    }
</script>
<style>
    .el-loading-mask {
        position: fixed;
        z-index: 9999;
    }
</style>
