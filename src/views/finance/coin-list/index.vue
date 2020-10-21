<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchFormData" class="demo-form-inline" ref="releaseSearch">
            <el-form-item label="账户类型" prop="accountType">
                <el-select v-model="searchFormData.accountType" filterable placeholder="类型">
                    <el-option label="公司账户" :value="companyAccountId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="searchFormData.type" filterable placeholder="类型">
                    <el-option label="注册奖励" value="CMS_REGISTER_AWARD"></el-option>
                    <el-option label="交易奖励" value="CMS_TRANSACTION_AWARD"></el-option>
                    <el-option label="充值奖励" value="CMS_CHARGE_AWARD"></el-option>
                    <el-option label="锁仓奖励" value="CMS_LOCK_AWARD"></el-option>
                    <el-option label="邀请奖励" value="CMS_INVITATION_AWARD"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="uid" prop="uid">
                <el-input v-model="searchFormData.uid" placeholder="uid"></el-input>
            </el-form-item>
            <el-form-item label="赠币日期" prop="bonusDate">
                <el-date-picker
                    v-model="searchFormData.bonusDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getRecord('searched')">搜索</el-button>
                <el-button @click="resetSearchForm">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            stripe
            :data="recordList"
            style="width: 100%">
            <el-table-column
                label="赠币时间"
                prop="createTime">
                <template slot-scope="props">
                    {{ props.row.createTime | getZoneTime }}
                </template>
            </el-table-column>
            <el-table-column
                label="类型">
                <template slot-scope="props">
                    {{ matchType(props.row.presentType) }}
                </template>
            </el-table-column>
            <el-table-column
                label="uid"
                prop="userId">
            </el-table-column>
            <el-table-column
                label="增币数量"
                prop="amount">
            </el-table-column>
            <el-table-column
                label="赠币币种"
                prop="currency">
            </el-table-column>
            <el-table-column
                label="操作人">
                <template slot-scope="props">
                    {{props.row.operationRole}}<span v-if="props.row.operatorName">({{props.row.operatorName}})</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                    @pagination="getRecord"/>
    </div>
</template>

<script>
    import {getCoinList, getCompanyAccount} from '@/api/finance/coin-list'
    import Pagination from '@/components/Pagination'

    export default {
        components: {
            Pagination
        },
        data () {
            return {
                // 查询条件
                searchFormData: {
                    accountType: '',
                    type: '',
                    uid: '',
                    bonusDate: null
                },
                // 查询条件（搜索）
                searchFormDataFilter: {
                    accountType: '',
                    type: '',
                    uid: '',
                    bonusDate: null
                },
                // 赠币列表
                recordList: [],
                total: 0,
                pageNum: 1,
                pageSize: 20,
                // 公司账户id
                companyAccountId: ''
            }
        },
        created () {
            // 初始化数据
            this.getRecord()
            this.getCompanyAccount()
        },
        methods: {
            // 获取赠币记录列表
            getRecord (str) {
                if (str === 'searched') {
                    this.searchFormDataFilter = JSON.parse(JSON.stringify(this.searchFormData))
                    this.pageNum = 1
                }
                let formData = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageNum: this.pageNum.toString(),
                        pageSize: this.pageSize.toString(),
                        filter: {
                            bizType: '0',
                            bizAccountId: this.searchFormDataFilter.accountType,
                            presentType: this.searchFormDataFilter.type,
                            userId: this.searchFormDataFilter.uid
                        }
                    }
                }
                formData.data.filter['startTime'] = ''
                formData.data.filter['endTime'] = ''
                if (this.searchFormDataFilter.bonusDate) {
                    formData.data.filter['startTime'] = this.searchFormDataFilter.bonusDate[0]
                    formData.data.filter['endTime'] = this.searchFormDataFilter.bonusDate[1]
                }
                formData.data.filter = this.removeSpaces(formData.data.filter)
                this.searchFormData.uid = this.removeSpaces(this.searchFormData.uid)
                getCoinList(formData).then(res => {
                    if (res.code.toString() === '0') {
                        this.total = res.data.total
                        this.pageNum = res.data.pageNum
                        this.pageSize = res.data.pageSize
                        this.recordList = res.data.list
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            // 获取公司账户信息
            getCompanyAccount () {
                let formData = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getCompanyAccount(formData).then(res => {
                    this.companyAccountId = res.data
                }).catch(err => {
                    this.$message.error(err)
                })
            },
            // 重置搜索
            resetSearchForm () {
                this.$refs.releaseSearch.resetFields()
                this.searchFormData.bonusDate = null
                this.getRecord('searched')
            },
            // 类型
            matchType (state) {
                switch (state) {
                case 'CMS_REGISTER_AWARD':
                    return '注册奖励'
                case 'CMS_TRANSACTION_AWARD':
                    return '交易奖励'
                case 'CMS_CHARGE_AWARD':
                    return '充值奖励'
                case 'CMS_LOCK_AWARD':
                    return '锁仓奖励'
                case 'CMS_INVITATION_AWARD':
                    return '邀请奖励'
                default:
                    break
                }
            }
        }
    }
</script>
