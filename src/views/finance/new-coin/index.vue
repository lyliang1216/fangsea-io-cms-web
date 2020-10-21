<template>
    <div class="app-container">
        <!--<h4 class="content-title">新增赠币</h4>-->
        <el-form :model="newCoinForm" class="demo-form-inline" ref="newCoinForm" :rules="newCoinFormRules">
            <el-form-item label="账户类型" prop="accountType">
                <el-select v-model="newCoinForm.accountType" filterable placeholder="账户类型">
                    <el-option :label="'公司账户 (' + companyAccountId + ')'" :value="companyAccountId"></el-option>
                </el-select>
                <span v-if="newCoinForm.accountType" style="margin-left: 8px;">账户ID：{{newCoinForm.accountType}}</span>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="newCoinForm.type" filterable placeholder="类型">
                    <el-option label="注册奖励" value="CMS_REGISTER_AWARD"></el-option>
                    <el-option label="交易奖励" value="CMS_TRANSACTION_AWARD"></el-option>
                    <el-option label="充值奖励" value="CMS_CHARGE_AWARD"></el-option>
                    <el-option label="锁仓奖励" value="CMS_LOCK_AWARD"></el-option>
                    <el-option label="邀请奖励" value="CMS_INVITATION_AWARD"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="币种" prop="code">
                <el-select v-model="newCoinForm.code" filterable placeholder="币种">
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
                <el-button @click="importTemplateDialog">导入模板</el-button>
                <el-button type="primary" @click="formSubmit">确定</el-button>
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
                <el-button size="medium" type="primary" @click="uploadTemplate">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {newCoin, importNewCoin, getCompanyAccount, getWalletCurrency} from '@/api/finance/new-coin'
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
                // 新增赠币表单校验规则
                newCoinFormRules: {
                    accountType: {required: true, message: '请选择账户类型', trigger: 'change'},
                    type: {required: true, message: '请选择类型', trigger: 'change'},
                    code: {required: true, message: '请选择币种', trigger: 'change'},
                    association: {required: true, message: '请输入关联用户和数量', trigger: 'blur'}
                },
                // 币种列表
                currencyList: [],
                // 导入模板弹窗显示
                dialogImportTemplateShow: false,
                importTemplateData: {
                    file: ''
                },
                files: [],
                uploadFile: '',
                uploadWaiting: false,
                // 公司账户id
                companyAccountId: ''
            }
        },
        created () {
            // 初始化数据
            this.getWalletCurrency()
            this.getCompanyAccount()
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
                    this.currencyList = res.data.list
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            // 获取公司账户信息
            getCompanyAccount () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getCompanyAccount(formData).then(res => {
                    this.companyAccountId = res.data
                })
            },
            // 打开导入模板弹窗
            importTemplateDialog () {
                this.dialogImportTemplateShow = true
            },

            changeFile (file, fileList) {
                this.uploadFile = file.raw
            },
            // 导入模板
            uploadTemplate () {
                // this.$refs.upload.submit()
                if (this.uploadFile === '') {
                    this.$message.error('请选择文件')
                    return false
                }
                let formData = new FormData()
                formData.append('file', this.uploadFile)
                formData.append('bizType', '0')
                this.uploadWaiting = true
                importNewCoin(formData).then(res => {
                    this.uploadWaiting = true
                    if (res.code.toString() === '0') {
                        this.$message.success('导入成功')
                        this.$router.push({path: '/finance/coinlist'})
                    } else {
                        this.$message.error(res.msg)
                        this.uploadWaiting = false
                        this.uploadFile = ''
                        this.files = []
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            // 导入成功后回调
            uploadSuccess (res) {
                if (res.code.toString() === '0') {
                    this.$message.success('导入成功')
                    this.$router.push({path: '/finance/coinlist'})
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
                        bizType: '0'
                    }
                }

                this.$refs['newCoinForm'].validate((valid) => {
                    if (valid) {
                        newCoin(formData).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('添加成功')
                                this.$router.push({path: '/finance/coinlist'})
                            } else {
                                this.$message.error(res.msg)
                            }
                        }).catch(err => {
                            this.$message.error(err)
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
