<template>
    <div class="app-container">
        <el-form :model="newCoinForm" class="demo-form-inline newBonusForm" ref="newBonusForm"
                 :rules="newCoinFormRules">
            <el-form-item label="账户类型" prop="accountType">
                <el-select v-model="newCoinForm.accountType" filterable size="small" placeholder="账户类型"
                           style="width: 320px">
                    <template v-for="item in projectList">
                        <el-option :title="item.name + '(' + item.projectAccountId + ')'"
                                   :label="item.name + '(' + item.projectAccountId + ')'"
                                   :value="item.projectAccountId"></el-option>
                    </template>
                </el-select>
                <span v-if="newCoinForm.accountType" style="margin-left: 8px;">账户ID：{{newCoinForm.accountType}}</span>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="newCoinForm.type" filterable size="small" placeholder="类型">
                    <el-option label="通证分红" value="CMS_PTO_DIVIDEND"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种" prop="code">
                <el-select v-model="newCoinForm.code" filterable size="small" placeholder="币种">
                    <el-option
                        v-for="item in currencyList"
                        :key="item.curId"
                        :label="item.curName"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联用户和数量" prop="association">
                <p class="associationTip">
                    请输入（uid:数量,uid:数量,uid:数量）的格式，多个uid以","分隔；所有符号均使用英文符号，例如：10001:10,10002:10,10003:10</p>
                <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="newCoinForm.association">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" @click="importTemplateDialog">导入模板</el-button>
                <el-button size="small" type="primary" @click="formSubmit">确定</el-button>
            </el-form-item>
        </el-form>
        <el-dialog v-el-drag-dialog :visible.sync="dialogImportTemplateShow" @close="closeDialog"
                   :close-on-click-modal="false" title="excel导入">
            <el-upload
                class="upload-demo"
                accept=".xls,.xlsx"
                ref="upload"
                :multiple="false"
                action=""
                :limit=1
                :file-list="files"
                :auto-upload="false"
                :on-change="changeFile"
                :onSuccess="uploadSuccess"
                :onError="uploadError">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="downloadTemplate">下载模板
                </el-button>
                <div slot="tip" class="el-upload__tip">请先下载模板，按模板编辑数据后再次导入Excel文件</div>
            </el-upload>
            <div class="btns">
                <el-button size="small" type="primary" @click="uploadTemplate" :loading="uploadWaiting">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {newCoin, importNewCoin, getProjectList, getWalletCurrency} from '@/api/post-investment/new-bonus'
    import elDragDialog from '@/directives/el-dragDialog'

    export default {
        directives: {elDragDialog},
        data () {
            return {
                newCoinForm: {
                    accountType: '',
                    type: '',
                    code: '',
                    association: ''
                },
                // 新增分红表单校验规则
                newCoinFormRules: {
                    accountType: {required: true, message: '请选择账户类型', trigger: 'change'},
                    type: {required: true, message: '请选择类型', trigger: 'change'},
                    code: {required: true, message: '请选择币种', trigger: 'change'},
                    association: {required: true, message: '请输入关联用户和数量', trigger: 'blur'}
                },
                // 币种列表
                currencyList: [],
                // 项目列表
                projectList: [],
                // 导入模板弹窗显示
                dialogImportTemplateShow: false,
                files: [],
                uploadFile: '',
                uploadWaiting: false
            }
        },
        created () {
            // 初始化数据
            this.getWalletCurrency()
        },
        methods: {
            // 获取币种列表
            getWalletCurrency () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: 1,
                        pageSize: 0,
                        filter: {
                            state: '1',
                            neState: '0'
                        }
                    }
                }
                getWalletCurrency(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.currencyList = res.data.list
                        this.getProjectList()
                    }
                })
            },
            // 获取项目列表
            getProjectList () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getProjectList(formData).then(res => {
                    this.projectList = res.data
                })
            },
            // 打开导入模板弹窗
            importTemplateDialog () {
                this.dialogImportTemplateShow = true
            },
            // 导入模板
            uploadTemplate () {
                // this.$refs.upload.submit();
                if (this.uploadFile === '') {
                    this.$message.error('请选择文件')
                    return false
                }
                let formData = new FormData()
                formData.append('file', this.uploadFile)
                formData.append('bizType', '1')
                this.uploadWaiting = true
                importNewCoin(formData).then(res => {
                    this.uploadWaiting = true
                    if (res.code.toString() === '0') {
                        this.$message.success('导入成功')
                        this.$router.push({path: '/postinvestment/bonuslist'})
                    } else {
                        this.$message.error(res.msg)
                        this.uploadWaiting = false
                        this.uploadFile = ''
                        this.files = []
                    }
                })
            },
            changeFile (file, fileList) {
                this.uploadFile = file.raw
            },
            // 导入成功后回调
            uploadSuccess (res) {
                if (res.code.toString() === '0') {
                    this.$message.success('导入成功')
                    this.$router.push({path: '/postinvestment/bonuslist'})
                } else {
                    this.$message.error(res.msg)
                    this.uploadWaiting = false
                    this.uploadFile = ''
                    this.files = []
                }
            },
            // 导入失败后回调
            uploadError (res) {
                this.$message.error(res.msg)
                this.uploadWaiting = false
                this.uploadFile = ''
                this.files = []
            },
            // 导出
            downloadTemplate () {
                window.location.href = '/api/v2/cms/wallet/present/export/excel'
            },
            // 关闭导入弹窗
            closeDialog () {
                this.dialogImportTemplateShow = false
            },
            // 提交表单
            formSubmit () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        outBizAccountId: parseInt(this.newCoinForm.accountType),
                        presentType: this.newCoinForm.type,
                        currency: this.newCoinForm.code,
                        presentText: this.newCoinForm.association,
                        bizType: '1'
                    }
                }
                this.$refs['newBonusForm'].validate((valid) => {
                    if (valid) {
                        newCoin(formData).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('添加成功')
                                this.$router.push({path: '/postinvestment/bonuslist'})
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/assets/css/index.scss";

    .associationTip {
        margin: 0;
        line-height: 30px;
        display: inline-block;
    }
</style>
<style lang="scss">
    .el-select-dropdown {
        max-width: 200px;
    }

    .el-select-dropdown__list {
        max-width: 200px;
    }

    .el-select-dropdown__item {
        max-width: 195px;
        min-width: 195px;
        display: inline-block;
    }

    .el-select-dropdown__item span {
        max-width: 195px;
        min-width: 195px;
        display: inline-block;
    }
</style>
