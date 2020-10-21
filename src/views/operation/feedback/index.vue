<template>
    <div class="app-container">
        <h4>当前页面展示用户通过官网反馈的信息</h4>
        <el-table
            :data="feedbackList"
            stripe
            style="width: 100%">
            <el-table-column
                label="编号"
                width="100"
                prop="id">
            </el-table-column>
            <el-table-column
                label="姓名/昵称"
                width="160"
                prop="name">
                <template slot-scope="props">
                    <p class="copy-link" :title="props.row.name" @click="copyContent"
                       :data-clipboard-text="props.row.name">{{props.row.name}}</p>
                </template>
            </el-table-column>
            <el-table-column
                label="邮箱"
                width="160"
                prop="email">
                <template slot-scope="props">
                    <p class="copy-link" :title="props.row.email" @click="copyContent"
                       :data-clipboard-text="props.row.email">{{props.row.email}}</p>
                </template>
            </el-table-column>
            <el-table-column
                label="消息内容"
                prop="message">
                <template slot-scope="props">
                    <p class="copy-link" :title="props.row.message" @click="copyContent"
                       :data-clipboard-text="props.row.message">{{props.row.message}}</p>
                </template>
            </el-table-column>
            <el-table-column
                label="时间"
                width="200"
                prop="feedbackTime">
                <template slot-scope="props">
                    {{props.row.feedbackTime | getZoneTime}}
                </template>
            </el-table-column>
            <el-table-column
                width="100"
                label="状态"
                prop="replyStatus">
                <template slot-scope="props">
                    {{props.row.replyStatus | getstate}}
                </template>
            </el-table-column>
            <el-table-column
                width="100"
                label="操作">
                <template slot-scope="props">
                    <a v-auth="{id: 10100060001}"
                       v-if="props.row.replyStatus.toString() === '0'"
                       class="operate" href="javascript:;"
                       @click="showDialog(props.row)">已回复</a>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="getFeedback"/>
        <!--弹框编辑审核-->
        <el-dialog
            title="此信息已经回复"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="30%"
            center>
            <p class="check-msg">已经回复，该反馈消息将被标记为“已回复”</p>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取消</el-button>
                <el-button size="small" type="danger" @click="checkState">是的，已回复</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getFeedbackList, checkMsgState} from '@/api/operation/feedback'
    import Pagination from '@/components/Pagination'
    import Clipboard from 'clipboard'

    export default {
        data () {
            return {
                // 反馈列表
                feedbackList: [],
                // 筛选条件
                filter: {
                    id: '',
                    name: '',
                    email: '',
                    message: '',
                    feedbackTime: '',
                    replyStatus: ''
                },
                // 显示确认回复弹框
                dialogVisible: false,
                // 当前操作id
                nowId: '',
                // 防止复制重复点击
                cancopy: true,
                // 当前页
                currentPage: 1,
                // 总条数
                total: 0,
                // 每页显示数量
                pageSize: 10
            }
        },
        mounted () {
            this.getFeedback()
        },
        methods: {
            /**
             * 获取反馈信息列表
             */
            getFeedback () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize,
                        filter: this.filter
                    }
                }
                getFeedbackList(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.feedbackList = res.data.list
                        this.total = res.data.total
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 显示弹框
             */
            showDialog (row) {
                this.nowId = row.id
                this.dialogVisible = true
            },
            /**
             * 确认修改状态
             */
            checkState () {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        id: this.nowId
                    }
                }
                checkMsgState(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.dialogVisible = false
                        this.getFeedback()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).catch(err => {
                    this.$message.error(err.msg)
                })
            },
            /**
             * 复制点击内容
             */
            copyContent () {
                if (this.cancopy) {
                    this.cancopy = false
                    let clipboard = new Clipboard('.copy-link')
                    clipboard.on('success', e => {
                        this.$message.success('复制成功')
                        clipboard.destroy()
                    })
                    clipboard.on('error', e => {
                        this.$message.error(this.$t('复制失败，请手动复制'))
                        clipboard.destroy()
                    })
                    setTimeout(() => {
                        this.cancopy = true
                    }, 1000)
                }
            },
            // 截取时间字符串
            substr (str) {
                let newStr = str.substring(0, 16)
                return newStr
            }
        },
        filters: {
            /**
             *  状态判断
             *  @param val 当前状态值
             */
            getstate (val) {
                switch (val.toString()) {
                case '0':
                    return '待回复'
                case '1':
                    return '已回复'
                }
            }
        },
        components: {Pagination}
    }
</script>

<style scoped>
    h4 {
        font-weight: normal;
        margin-top: 0;
    }

    p {
        margin: 0;
    }

    .copy-link {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }

    .operate {
        color: #2ea9df;
    }

    .check-msg {
        text-align: center;
    }
</style>
