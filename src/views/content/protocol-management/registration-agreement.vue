<template>
    <div class="components-container">
        <el-tabs type="border-card" :value="activeTab" :before-leave="tabChangeListener">
            <el-tab-pane label="简体中文" name="zh_CN">
                <el-form ref="protocolFormZh" :model="protocolForm" label-width="80px">
                    <div>
                        <h4>注册协议</h4>
                        <tinymce ref="editerZh" v-model="protocolForm.value" :height="300"/>
                        <el-form-item label="是否显示">
                            <el-radio-group v-model="protocolForm.isUse">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="protocolSubmit('protocolFormZh')">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="繁体中文" name="zh_TW">
                <el-form ref="protocolFormTw" :model="protocolForm" label-width="80px">
                    <div>
                        <h4>注册协议</h4>
                        <tinymce ref="editerTw" v-model="protocolForm.value" :height="300"/>
                        <el-form-item label="是否显示">
                            <el-radio-group v-model="protocolForm.isUse">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="protocolSubmit('protocolFormTw')">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="English" name="en_US">
                <el-form ref="protocolFormEn" :model="protocolForm" label-width="80px">
                    <div>
                        <h4>注册协议</h4>
                        <tinymce ref="editerEn" v-model="protocolForm.value" :height="300"/>
                        <el-form-item label="是否显示">
                            <el-radio-group v-model="protocolForm.isUse">
                                <el-radio :label="true">是</el-radio>
                                <el-radio :label="false">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <el-form-item>
                        <el-button type="primary" @click="protocolSubmit('protocolFormEn')">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {getProtocol, updateProtocol} from '@/api/content/protocol-management'
    import {compreObj} from '@/utils/langTabFuncs'
    import Tinymce from '@/components/Tinymce'

    export default {
        data () {
            return {
                // 当前语言
                activeTab: 'zh_CN',
                // 当前表单数据
                protocolForm: {},
                // 原始表单数据，用于判断表单内容是否有修改
                oldFormData: {}
            }
        },
        created () {
            // 初始化数据
            this.getProtocolData()
        },
        methods: {
            // 获取免责条款数据
            getProtocolData () {
                const formData = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: this.activeTab,
                    data: {
                        app: 'user',
                        key: 'user.register.setting_member_license'
                    }
                }
                getProtocol(formData).then(response => {
                    if (response.data) {
                        this.protocolForm = Object.assign({}, response.data)
                        this.oldFormData = Object.assign({}, response.data)
                        switch (this.activeTab) {
                        case 'zh_CN':
                            this.$refs['editerZh'].setContent(this.protocolForm === null ? '' : this.protocolForm.value)
                            break
                        case 'zh_TW':
                            this.$refs['editerTw'].setContent(this.protocolForm === null ? '' : this.protocolForm.value)
                            break
                        case 'en_US':
                            this.$refs['editerEn'].setContent(this.protocolForm === null ? '' : this.protocolForm.value)
                            break
                        }
                    }
                })
            },
            // 提交数据
            protocolSubmit (formName, getData) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const formData = {
                            traceId: Math.random().toString(36).substr(2),
                            locale: this.activeTab,
                            data: {
                                app: 'user',
                                key: 'user.register.setting_member_license',
                                value: this.protocolForm.value,
                                isUse: this.protocolForm.isUse
                            }
                        }
                        updateProtocol(formData).then(response => {
                            if (response.code.toString() === '0') {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                this.oldFormData = Object.assign({}, this.protocolForm)
                                if (getData === 'toGetData') {
                                    this.getProtocolData()
                                }
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            // 监听tab切换
            tabChangeListener (activeName, oldActiveName) {
                let protocolForm = this.protocolForm
                let oldFormData = this.oldFormData
                if (compreObj(protocolForm, oldFormData) === false) {
                    return this.$confirm('本页内容尚未保存，点击确定将自动保存并切换，是否继续？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let subFormName = ''
                        switch (oldActiveName) {
                        case 'zh_CN':
                            subFormName = 'protocolFormZh'
                            break
                        case 'zh_TW':
                            subFormName = 'protocolFormTw'
                            break
                        case 'en_US':
                            subFormName = 'protocolFormEn'
                            break
                        }
                        this.activeTab = activeName
                        this.protocolSubmit(subFormName, 'toGetData')
                    }).catch(() => {
                        throw this.$message({
                            message: '警告哦，这是一条警告消息',
                            type: 'warning'
                        })
                    })
                } else {
                    this.activeTab = activeName
                    this.getProtocolData()
                }
            }
        },
        components: {Tinymce}
    }
</script>

<style scoped>
    .editor-content {
        margin-top: 20px;
    }
</style>
