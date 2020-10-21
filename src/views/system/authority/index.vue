<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="菜单权限" name="menu">
                <menu-authority v-if="activeName === 'menu'"></menu-authority>
            </el-tab-pane>
            <el-tab-pane label="操作权限" name="opera" v-auth="{id: 10600030007}">
                <operation-authority v-if="activeName === 'opera'"></operation-authority>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import OperationAuthority from '@/views/system/authority/components/OperationAuthority'
    import MenuAuthority from '@/views/system/authority/components/MenuAuthority'

    export default {
        data () {
            return {
                activeName: 'menu'
            }
        },
        created () {
            if (this.$route.query.name === 'opera') {
                this.activeName = 'opera'
            }
        },
        components: {
            OperationAuthority,
            MenuAuthority
        }
    }
</script>

<style lang="scss" scoped>
    .app-container {
    }
</style>
