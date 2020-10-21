<template>
    <div class="app-container">
        <div class="setcontent">
            <div class="chooseopen">
                <p class="title">是否开启提醒</p>
                <el-switch
                    class="switchbox"
                    @change="checkopenall"
                    v-model="openremind"
                    active-color="#13ce66"
                    inactive-color="#dcdfe6"
                    active-text="开启"
                    inactive-text="关闭">
                </el-switch>
            </div>
        </div>
        <div class="msgset" v-show="openremind">
            <p>提醒方式</p>
            <div class="setcontent">
                <div class="chooseopen">
                    <p class="title">短信提醒</p>
                    <el-switch
                        @change="checkopen"
                        class="switchbox"
                        v-model="opensms"
                        active-color="#13ce66"
                        inactive-color="#dcdfe6"
                        active-text="开启"
                        inactive-text="关闭">
                    </el-switch>
                    <p class="tips">多个通知请通过英文逗号分隔，如：86-18600000000,66-90600000</p>
                </div>
                <el-input v-show="opensms" placeholder="" v-model="tel" class="input-with-select">
                    <el-select v-model="areacode" slot="prepend" class="areacode-select" placeholder="">
                        <el-option
                            v-for="item in areaCodelist"
                            :key="item.regionId"
                            :label="`+${item.areaCode} ${item.localName}`"
                            :value="item.areaCode">
                        </el-option>
                    </el-select>
                    <el-button slot="append" size="small" @click="addtel">新增</el-button>
                </el-input>
                <el-input
                    v-show="opensms"
                    class="inputtextarea"
                    rows="5"
                    type="textarea"
                    v-model="smslist"
                    placeholder="请使用','分隔">
                </el-input>
                <div class="chooseopen">
                    <p class="title">邮件提醒</p>
                    <el-switch
                        @change="checkopen"
                        class="switchbox"
                        v-model="openmail"
                        active-color="#13ce66"
                        inactive-color="#dcdfe6"
                        active-text="开启"
                        inactive-text="关闭">
                    </el-switch>
                    <p class="tips">多个通知请通过英文逗号分隔，如：stefans.zhou@fangsea.io,stefans.zhou@fangsea.sg</p>
                </div>
                <el-input
                    v-show="openmail"
                    class="inputtextarea"
                    rows="5"
                    type="textarea"
                    v-model="maillist"
                    placeholder="请使用','分隔">
                </el-input>
            </div>
        </div>
        <p class="savebtn">
            <el-button type="primary" size="small" round @click="savesetting">保&emsp;存</el-button>
        </p>
    </div>
</template>

<script>
    import {getset, saveset, getAreacode} from '@/api/content/reminder-setting'

    export default {
        name: 'index',
        data () {
            return {
                // 提醒设置
                openremind: true,
                // 短信提醒
                opensms: true,
                // 邮件提醒
                openmail: true,
                // 电话联系方式
                smslist: '',
                // 邮件联系方式
                maillist: '',
                // 选择的区号
                areacode: '',
                // 输入的电话
                tel: '',
                // 区号列表
                areaCodelist: []
            }
        },
        mounted () {
            this.getareacode()
            this.getreminderset()
        },
        methods: {
            /**
             *  获取提醒设置
             */
            getreminderset () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        app: 'cms',
                        key: 'cms.message_remind'
                    }
                }
                getset(params).then(res => {
                    if (res.code.toString() === '0') {
                        let value = JSON.parse(res.data.value)
                        this.openremind = value.openremind
                        this.opensms = value.opensms
                        this.openmail = value.openmail
                        this.smslist = value.smslist
                        this.maillist = value.maillist
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            /**
             *  获取区号
             */
            getareacode () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getAreacode(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.areaCodelist = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            /**
             *  新增电话号码
             */
            addtel () {
                if (this.tel !== '') {
                    if (this.smslist === '') {
                        this.smslist += this.areacode + '-' + this.tel
                    } else {
                        this.smslist += ',' + this.areacode + '-' + this.tel
                    }
                    this.tel = ''
                }
            },
            /**
             *  保存设置
             */
            savesetting () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        app: 'cms',
                        key: 'cms.message_remind',
                        value: JSON.stringify({
                            openremind: this.openremind,
                            opensms: this.opensms,
                            openmail: this.openmail,
                            smslist: this.smslist,
                            maillist: this.maillist
                        }),
                        isUse: true
                    }
                }
                saveset(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('保存成功')
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            /**
             *  关闭两个提醒方式时，关闭提醒设置
             */
            checkopen () {
                this.openremind = this.opensms || this.openmail
            },
            /**
             *  开启关闭提醒时，设置提醒方式开启关闭
             *  @param val 新状态的值
             */
            checkopenall (val) {
                this.openremind = val
                this.opensms = val
                this.openmail = val
            }
        }
    }
</script>
<style scoped>
    .chooseopen {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .setcontent {
        padding-left: 40px;
    }

    .title {
        margin-right: 10px;
    }

    .tips {
        margin-left: 20px;
        color: #999;
        font-size: 14px;
    }

    /deep/ .switchbox * {
        font-size: 16px;
    }

    .msgset {
        border-top: 1px solid #e6e6e6;
    }

    .input-with-select {
        width: 375px;
        margin-bottom: 16px;
    }

    .areacode-select {
        width: 100px;
        height: 40px;
        background: #fff;
        border: 1px solid #DCDFE6;
        border-right: 0;
        box-sizing: border-box;
    }

    .inputtextarea {
        margin-bottom: 16px;
    }

    .savebtn {
        text-align: center;
    }

    /deep/ .el-input-group__append {
        background: transparent;
    }
</style>
