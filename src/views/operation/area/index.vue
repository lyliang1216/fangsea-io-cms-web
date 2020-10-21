<template>
    <div class="app-container">
        <el-table
            stripe
            :data="areaData"
            :load="getChildren"
            style="width: 100%"
            row-key="regionId"
            lazy
            ref="regionTree"
        >
            <el-table-column
                prop="localName"
                label="地区名称"
                width="180"/>
            <el-table-column
                prop="ordernum"
                label="排序"
                width="180"/>
            <el-table-column
                label="区号"
                width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.intelCode">+ {{ scope.row.intelCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        v-auth="{id: 10100050001}"
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                        v-auth="{id: 10100050002}"
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" title="编辑地区">
            <el-form ref="editMessageData" :model="editMessageData" status-icon label-width="100px"
                     class="demo-ruleForm">
                <el-alert
                    title="地区名称、地区代码、手机区号在平台运行期间无法修改，若需修改请联系技术"
                    type="warning"
                    :closable="false"
                    style="margin-bottom: 8px;">
                </el-alert>
                <el-form-item label="地区名称" prop="localName">
                    <el-input v-model.number="editMessageData.localName" :disabled="true"/>
                </el-form-item>
                <el-form-item label="地区代码" prop="code">
                    <el-input v-model.number="editMessageData.code" :disabled="true"/>
                </el-form-item>
                <el-form-item label="排序" prop="ordernum">
                    <el-input v-model.number="editMessageData.ordernum"/>
                </el-form-item>
                <el-form-item label="是否显示" prop="ordernum">
                    <el-radio-group v-model="editMessageData.disabled" @change="isShowChange">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否支持注册" prop="ordernum">
                    <el-radio-group v-model="editMessageData.isRegiste" :disabled="isRegisteDesabled">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('editMessageData')">提交</el-button>
                    <el-button @click="resetForm('editMessageData')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {findRegion, createRegion, deleteRegion} from '@/api/operation/area'
    import elDragDialog from '@/directives/el-dragDialog'

    export default {
        directives: {elDragDialog},
        data () {
            return {
                // 地区数据集合
                areaData: [],
                // 控制编辑弹窗显示
                dialogTableVisible: false,
                // 正在编辑的地区数据
                editMessageData: {},
                // 是否注册显示选项禁用状态
                isRegisteDesabled: false
            }
        },
        created () {
            // 默认获取一级地区数据
            this.getCountries()
        },
        methods: {
            // 获取地区数据方法
            getCountries () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {}
                }
                findRegion(formData).then(response => {
                    let res = response.data
                    let newRes = []
                    for (let resItem of res) {
                        if (resItem.isLeaf === 'false') {
                            resItem['hasChildren'] = true
                        }
                        let index = res.indexOf(resItem)
                        newRes.splice(index, 1, resItem)
                    }
                    this.areaData = newRes
                })
            },
            // 获取并插入子地区数据
            getChildren (tree, treeNode, resolve) {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        regionId: tree.regionId
                    }
                }
                findRegion(formData).then(response => {
                    let res = response.data
                    let newRes = []
                    for (let resItem of res) {
                        if (resItem.isLeaf === 'false') {
                            resItem['hasChildren'] = true
                        }
                        let index = res.indexOf(resItem)
                        newRes.splice(index, 1, resItem)
                    }
                    for (let treeItem of this.areaData) {
                        if (treeItem.regionId === tree.regionId) {
                            treeItem['children'] = newRes
                            break
                        }
                    }
                    resolve(newRes)
                })
            },
            // 显示编辑地区数据弹窗
            handleEdit (index, row) {
                this.dialogTableVisible = true
                this.editMessageData = Object.assign({}, row)
                this.isShowChange(this.editMessageData.disabled)
            },
            // 删除地区数据
            handleDelete (index, row) {
                this.$confirm('此操作将永久删除该地区数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let formData = {
                        traceId: Math.random().toString(36).substr(2),
                        data: {
                            regionId: row.regionId
                        }
                    }
                    deleteRegion(formData).then(response => {
                        this.getCountries()
                        this.$refs.regionTree.doLayout()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 隐藏编辑弹框
            resetForm (formName) {
                this.dialogTableVisible = false
                this.isRegisteDesabled = false
                this.editMessageData = {}
            },
            // 提交编辑数据
            submitForm (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let formData = {
                            traceId: Math.random().toString(36).substr(2),
                            data: this.editMessageData
                        }
                        createRegion(formData).then(response => {
                            this.getCountries()
                            this.$refs.regionTree.doLayout()
                            this.resetForm()
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            })
                        })
                    } else {
                        this.$message.error('修改失败')
                        return false
                    }
                })
            },
            /**
             * 是否显示单选框change事件
             * @param label 是否显示单选框label值
             */
            isShowChange (label) {
                if (label === 'false') {
                    this.editMessageData.isRegiste = 'false'
                    this.isRegisteDesabled = true
                } else {
                    this.isRegisteDesabled = false
                }
            }
        }
    }
</script>
