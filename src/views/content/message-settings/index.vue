<template>
    <div id="message-settings">
        <div style="display: flex;align-items: center">
            <!-- 操作 -->
            <div class="message-settings-operation">
                <el-button v-auth="{id: 10400030001}" size="small" type="primary" @click="messageAdd"> + 添加</el-button>
            </div>
        </div>
        <!-- 表格 -->
        <el-table
            stripe
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="templateTitle"
                label="标题">
            </el-table-column>
            <el-table-column
                label="模板类型"
                width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.sendType | sendType}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.disabled | disabled }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="使用场景">
                <template slot-scope="scope">
                    <span>{{ useScene(scope.row.useScene) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="更新时间"
                width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.lastModified | getZoneTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        v-auth="{id: 10400030002}"
                        @click="handleEdit(scope.$index, scope.row)">编辑信息
                    </el-button>
                    <el-popover
                        placement="top"
                        width="160"
                        v-model="popoverIndex[scope.$index]">
                        <p>删除模板后，将无法恢复</p>
                        <div style="text-align: right; margin: 0">
                            <el-button size="small" type="text" @click="hidePopover(scope.$index)">取消</el-button>
                            <el-button type="primary" size="small"
                                       @click="deleteTemplate(scope.$index, scope.row.templateId)">删除
                            </el-button>
                        </div>
                        <el-button size="small" @click="popoverIndex[scope.$index] = true" v-auth="{id: 10400030003}"
                                   slot="reference">删除
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="currentPage" :limit.sync="pageSize"
                    @pagination="selectTemplate"/>
        <el-dialog
            :title="title"
            :close-on-click-modal="false"
            :destroy-on-close="false"
            @close="closeDialog"
            :before-close="beforeClose"
            :visible.sync="dialogFormVisibleCompileAdd">
            <el-form
                ref="form"
                :model="formEdit"
                label-width="120px">
                <el-form-item label="标题(简体中文)" v-if="activeTab === 'zh_CN'">
                    <el-input v-model="formEdit.templateTitle"></el-input>
                </el-form-item>
                <el-form-item label="标题(繁体中文)" v-if="activeTab === 'zh_TW'">
                    <el-input v-model="formEdit.templateTitle"></el-input>
                </el-form-item>
                <el-form-item label="标题(英语)" v-if="activeTab === 'en_US'">
                    <el-input v-model="formEdit.templateTitle"></el-input>
                </el-form-item>
                <el-row :gutter="4">
                    <el-col :span="6">
                        <el-form-item label="发送方式">
                            <el-select v-model="formEdit.sendType" placeholder="请选择" class="select-fs">
                                <el-option
                                    v-for="item in optionsSendType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="使用场景">
                            <el-select v-model="formEdit.useScene" placeholder="请选择" class="select-cj" filterable>
                                <el-option
                                    v-for="item in optionsUseScene"
                                    :key="item.value"
                                    :label="item.des"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="占位符">
                    <el-input v-model="formEdit.placeholder"></el-input>
                </el-form-item>
                <el-form-item label="启用状态">
                    <el-switch
                        v-model="formEdit.disabled"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="内容">
                    <el-radio-group v-model="formEdit.editor">
                        <el-radio-button label="1">富文本编辑器</el-radio-button>
                        <el-radio-button label="2">Markdown编辑器</el-radio-button>
                    </el-radio-group>
                    <el-button v-if="formEdit.sendType !== '1'" type="text" @click="resetTemplate" style="float: right">
                        重置邮件模板
                    </el-button>
                </el-form-item>
                <div class="tinymce-i18n-box" v-show="formEdit.editor === '1'">
                    <tinymce class="tinymce-i18n"
                             ref="editerZhAdd" id="editerZhAdd"
                             v-model="formEdit.richTextContent" :height="129"/>
                </div>
                <mavon-editor v-show="formEdit.editor === '2'"
                              ref="mdZh"
                              language="zh-CN"
                              v-model="formEdit.mdTextContent"
                              @imgAdd="imgAdd"
                              @change="saveMavon"
                              :toolbars="markdownOption"/>
                <div class="tool-btns">
                    <el-button type="primary" size="small" @click="saveForm"> 保存</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog
            :title="title"
            :close-on-click-modal="false"
            :destroy-on-close="false"
            @close="closeDialog"
            :before-close="beforeClose"
            :visible.sync="dialogFormVisibleCompileEdit">
            <el-form
                ref="form"
                :model="formEdit"
                label-width="120px">
                <el-tabs
                    :before-leave="beforeLeave"
                    type="card"
                    style="margin-bottom: 20px"
                    v-model="activeTab">
                    <el-tab-pane label="简体中文" name="zh_CN"></el-tab-pane>
                    <el-tab-pane label="繁体中文" name="zh_TW"></el-tab-pane>
                    <el-tab-pane label="English" name="en_US"></el-tab-pane>
                </el-tabs>
                <el-form-item label="标题(简体中文)" v-if="activeTab === 'zh_CN'">
                    <el-input v-model="formEdit.templateTitle"></el-input>
                </el-form-item>
                <el-form-item label="标题(繁体中文)" v-if="activeTab === 'zh_TW'">
                    <el-input v-model="formEdit.templateTitle"></el-input>
                </el-form-item>
                <el-form-item label="标题(英语)" v-if="activeTab === 'en_US'">
                    <el-input v-model="formEdit.templateTitle"></el-input>
                </el-form-item>
                <el-row :gutter="4">
                    <el-col :span="6">
                        <el-form-item label="发送方式">
                            <el-select v-model="formEdit.sendType" placeholder="请选择" class="select-fs">
                                <el-option
                                    v-for="item in optionsSendType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="使用场景">
                            <el-select v-model="formEdit.useScene" placeholder="请选择" class="select-cj" filterable>
                                <el-option
                                    v-for="item in optionsUseScene"
                                    :key="item.value"
                                    :label="item.des"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="占位符">
                    <el-input v-model="formEdit.placeholder"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-radio-group v-model="formEdit.editor">
                        <el-radio-button label="1">富文本编辑器</el-radio-button>
                        <el-radio-button label="2">Markdown编辑器</el-radio-button>
                    </el-radio-group>
                    <el-button v-if="formEdit.sendType !== '1'" type="text" @click="resetTemplate" style="float: right">
                        重置邮件模板
                    </el-button>
                </el-form-item>
                <div class="tinymce-i18n-box" v-show="formEdit.editor === '1'">
                    <tinymce class="tinymce-i18n"
                             ref="editerZhEdit" id="editerZhEdit"
                             v-model="formEdit.richTextContent" :height="129"/>
                </div>
                <mavon-editor v-show="formEdit.editor === '2'"
                              ref="mdZh"
                              language="zh-CN"
                              v-model="formEdit.mdTextContent"
                              @imgAdd="imgAdd"
                              @change="saveMavon"
                              :toolbars="markdownOption"/>
                <div class="tool-btns">
                    <el-button type="primary" size="small" @click="saveForm"> 保存</el-button>
                </div>
                <!-- 按钮 -->
                <div class="switch-qy">
                    <span>启用状态</span>
                    <el-switch
                        v-model="formEdit.disabled"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {
        selectTemplate,
        updateTemplate,
        deleteTemplate,
        getTemplate,
        addTemplate,
        getUseScen
    } from '@/api/content/message-settings'
    import Pagination from '@/components/Pagination'
    import {templateHtml} from '@/assets/emailHtml'
    import Tinymce from '@/components/Tinymce'
    import axios from '@/utils/request'

    export default {
        data () {
            return {
                // 邮件模板
                templateHtml: templateHtml,
                // markd配置项
                markdownOption: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    navigation: true, // 导航目录
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    subfield: true, // 单双栏模式
                    preview: true // 预览
                },
                // 应用场景
                optionsUseScene: [],
                // 列表数据
                tableData: [],
                // 数据总数
                total: 0,
                // 单页数量
                pageSize: 10,
                // 当前页
                currentPage: 1,
                // 控制删除确认框的显示
                popoverIndex: [],
                // 弹框名称
                title: '',
                // 显示隐藏添加弹框
                dialogFormVisibleCompileAdd: false,
                // 显示隐藏编辑弹框
                dialogFormVisibleCompileEdit: false,
                formEdit: {
                    // 模板id
                    templateId: 0,
                    // 新增标题
                    templateTitle: '',
                    // 发送方式
                    sendType: '',
                    // 使用场景
                    useScene: '',
                    // 占位符
                    placeholder: '',
                    // 启用状态
                    disabled: false,
                    // 最后更新时间
                    lastModified: '',
                    // 富文本内容
                    richTextContent: '',
                    // markdown 语法
                    mdTextContent: '',
                    // markdown html
                    mdRichTextContent: '',
                    // 编辑器类型
                    editor: '1'
                },
                formEditOld: {},
                // 发送方式
                optionsSendType: [{
                    value: '2',
                    label: '邮件'
                }, {
                    value: '1',
                    label: '短信'
                }],
                // 当前语言
                activeTab: 'zh_CN'
            }
        },
        created () {
            this.getUseScenFn()
            this.selectTemplate()
        },
        methods: {
            /**
             * 应用场景数据取得
             */
            getUseScenFn () {
                let params = {
                    traceId: Math.random().toString(36).substr(2)
                }
                getUseScen(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.optionsUseScene = res.data
                    }
                })
            },
            /**
             * 查询列表
             */
            selectTemplate () {
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        pageSize: this.pageSize,
                        pageNum: this.currentPage
                    }
                }
                selectTemplate(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.tableData = res.data.list
                        this.popoverIndex = []
                        this.tableData.forEach(() => {
                            this.popoverIndex.push(false)
                        })
                        this.total = res.data.total
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 获取列表使用场景
             */
            useScene (type) {
                for (let i in this.optionsUseScene) {
                    if (this.optionsUseScene[i].value === type) {
                        return this.optionsUseScene[i].des
                    }
                }
            },
            /**
             * 添加模板按钮
             */
            messageAdd () {
                this.title = '模板添加'
                this.dialogFormVisibleCompileAdd = true
                this.resetForm()
                this.$nextTick(() => {
                    if (this.$refs['editerZhAdd']) this.$refs['editerZhAdd'].setContent('')
                })
            },
            /**
             * 重置表单
             */
            resetForm () {
                this.formEdit = {
                    // 模板id
                    templateId: 0,
                    // 新增标题
                    templateTitle: '',
                    // 发送方式
                    sendType: '',
                    // 使用场景
                    useScene: '',
                    // 占位符
                    placeholder: '',
                    // 启用状态
                    disabled: false,
                    // 最后更新时间
                    lastModified: '',
                    // 富文本内容
                    richTextContent: '',
                    // markdown 语法
                    mdTextContent: '',
                    // markdown html
                    mdRichTextContent: '',
                    // 编辑器类型
                    editor: '1'
                }
                this.formEditOld = {...this.formEdit}
                this.activeTab = 'zh_CN'
            },
            /**
             * 编辑信息
             * @param index 下标
             * @param row   参数对象
             */
            handleEdit (index, row) {
                this.title = '模板编辑'
                this.resetForm()
                this.formEdit.templateId = row.templateId
                this.formEdit.disabled = row.disabled === 'false'
                this.dialogFormVisibleCompileEdit = true
                this.$nextTick(() => {
                    this.getRowData()
                })
            },
            /**
             * 查询指定id信息
             * @param locale 查询国际化
             */
            getRowData (locale = this.activeTab) {
                let params = {
                    traceId: Math.random().toString(36).substr(2),
                    locale: locale,
                    data: this.formEdit.templateId
                }
                getTemplate(params).then(res => {
                    if (res.code.toString() === '0') {
                        this.formEdit = res.data
                        this.formEdit.editor = res.data.editor.toString()
                        this.formEdit.disabled = res.data.disabled === 'false'
                        this.$nextTick(() => {
                            this.formEdit.richTextContent = res.data.richTextContent || ''
                            this.formEdit.mdTextContent = res.data.mdTextContent || ''
                            this.formEdit.mdRichTextContent = res.data.mdRichTextContent || ''
                            this.formEditOld = {...this.formEdit}
                            this.$refs['editerZhEdit'].setContent(res.data.richTextContent === null ? '' : res.data.richTextContent)
                        })
                    }
                })
            },
            /**
             * 切换语言前
             */
            beforeLeave (activeName) {
                if (this.compareForm(this.formEdit, this.formEditOld)) {
                    let flag = new Promise((resolve, reject) => {
                        this.$confirm('当前页面还未保存，如果离开，更改的内容将会丢失。', '提示', {
                            distinguishCancelAndClose: true,
                            confirmButtonText: '离开',
                            cancelButtonText: '留下',
                            type: 'warning'
                        })
                            .then(() => {
                                this.getRowData(activeName)
                                resolve()
                            })
                            .catch((action, err) => {
                                reject(err)
                            })
                    })
                    return flag
                } else {
                    if (this.formEdit.templateId) this.getRowData(activeName)
                }
            },
            /**
             * 同步修改markdown
             */
            saveMavon (value, render) {
                this.formEdit.mdTextContent = value
                this.formEdit.mdRichTextContent = render
            },
            /**
             * @param pos 图片下标
             * @param $file 图片对象
             * @returns {boolean} 过滤图片类型
             */
            imgAdd (pos, $file) {
                const isJPEG = $file.type === 'image/jpeg'
                const isPNG = $file.type === 'image/png'
                if (!isJPEG && !isPNG) {
                    this.$message.error('你只能上传jpg或png格式图片')
                    return false
                }
                // 第一步.将图片上传到服务器.
                let formdata = new FormData()
                formdata.append('file', $file)
                axios({
                    url: '/file/upload',
                    method: 'post',
                    data: formdata,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then((response) => {
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    /**
                     * $vm 指为mavonEditor实例，可以通过如下两种方式获取
                     * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
                     * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
                     */
                    this.$refs.md.$img2Url(pos, response.data.filePath)
                })
            },
            /**
             * 保存表单
             */
            saveForm () {
                if (this.formEdit.sendType === '' || this.formEdit.useScene === '' ||
                    this.formEdit.placeholder === '') {
                    this.$message.error('模板内容不能为空，请确定后点击添加')
                } else if (this.formEdit.editor === '1' && this.formEdit.richTextContent === '') {
                    this.$message.error('富文本内容不能为空，请确定后点击添加')
                } else if (this.formEdit.editor === '2' && this.formEdit.mdTextContent === '' && this.formEdit.mdRichTextContent === '') {
                    this.$message.error('Markdown内容不能为空，请确定后点击添加')
                } else {
                    let params = {
                        traceId: Math.random().toString(36).substr(2),
                        locale: this.activeTab,
                        data: {...this.formEdit}
                    }
                    params.data.richTextContent = this.formEdit.sendType === '1' ? this.formEdit.richTextContent.replace(/<[^>]+>/g, '') : this.formEdit.richTextContent
                    params.data.mdRichTextContent = this.formEdit.sendType === '1' ? this.formEdit.mdRichTextContent.replace(/<[^>]+>/g, '') : this.formEdit.mdRichTextContent
                    params.data.disabled = (!this.formEdit.disabled).toString()
                    if (this.title === '模板添加') {
                        addTemplate(params).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('新增成功')
                                this.selectTemplate()
                                this.formEditOld = {...this.formEdit}
                                this.resetForm()
                                this.dialogFormVisibleCompileAdd = false
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    } else {
                        updateTemplate(params).then(res => {
                            if (res.code.toString() === '0') {
                                this.$message.success('保存成功')
                                this.formEditOld = {...this.formEdit}
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    }
                }
            },
            // 隐藏删除窗口 this.$set( obj, key, val)
            hidePopover (index) {
                this.$set(this.popoverIndex, index, false)
            },
            /**
             * 删除模板
             * @param index 数据索引
             * @param templateId 模板id
             */
            deleteTemplate (index, templateId) {
                this.popoverIndex[index] = false
                let data = {
                    traceId: Math.random().toString(36).substr(2),
                    data: {
                        templateId: templateId
                    }
                }
                deleteTemplate(data).then(res => {
                    if (res.code.toString() === '0') {
                        this.$message.success('删除模板成功')
                        this.selectTemplate()
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            /**
             * 关闭前确认修改
             * @param done 执行关闭弹窗
             */
            beforeClose (done) {
                if (this.compareForm(this.formEdit, this.formEditOld)) {
                    this.$confirm('当前页面还未保存，如果离开，更改的内容将会丢失。关闭', '提示', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '离开',
                        cancelButtonText: '留下',
                        type: 'warning'
                    })
                        .then(() => {
                            done()
                        })
                        .catch(() => {
                            return false
                        })
                } else {
                    done()
                }
            },
            /**
             * 比较数据是否相等 true是不等
             * @param newForm 新数据
             * @param oldForm 旧数据
             */
            compareForm (newForm, oldForm) {
                let formEdit = {...newForm, richTextContent: newForm.richTextContent.replace(/<[^>]+>/g, ''), mdRichTextContent: newForm.mdRichTextContent.replace(/<[^>]+>/g, '')}
                let formEditOld = {...oldForm, richTextContent: oldForm.richTextContent.replace(/<[^>]+>/g, ''), mdRichTextContent: oldForm.mdRichTextContent.replace(/<[^>]+>/g, '')}
                return JSON.stringify(formEdit) !== JSON.stringify(formEditOld)
            },
            /**
             * 关闭弹框
             */
            closeDialog () {
                this.resetForm()
                if (this.$refs['editerZhAdd']) this.$refs['editerZhAdd'].setContent('')
                if (this.$refs['editerZhEdit']) this.$refs['editerZhEdit'].setContent('')
                this.dialogFormVisibleCompileAdd = false
                this.dialogFormVisibleCompileEdit = false
            },
            /**
             * 重置邮件模板
             */
            resetTemplate () {
                if (this.formEdit.editor === '2') {
                    if (this.activeTab === 'zh_CN') {
                        this.formEdit.mdTextContent = this.templateHtml.cn
                    } else if (this.activeTab === 'zh_TW') {
                        this.formEdit.mdTextContent = this.templateHtml.tw
                    } else if (this.activeTab === 'en_US') {
                        this.formEdit.mdTextContent = this.templateHtml.en
                    }
                } else if (this.dialogFormVisibleCompileAdd) {
                    this.$refs['editerZhAdd'].setContent(this.templateHtml.cn)
                } else if (this.dialogFormVisibleCompileEdit) {
                    if (this.activeTab === 'zh_CN') {
                        this.$refs['editerZhEdit'].setContent(this.templateHtml.cn)
                    } else if (this.activeTab === 'zh_TW') {
                        this.$refs['editerZhEdit'].setContent(this.templateHtml.tw)
                    } else if (this.activeTab === 'en_US') {
                        this.$refs['editerZhEdit'].setContent(this.templateHtml.en)
                    }
                }
            }
        },
        filters: {
            sendType (type) {
                return type === '1' ? '短信' : '邮箱'
            },
            disabled (bool) {
                return bool === 'true' ? '禁用' : '启用'
            }
        },
        components: {
            Pagination,
            Tinymce
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    /deep/ .v-note-wrapper {
        border: 1px solid rgb(197, 197, 197) !important;
        border-radius: 0;
        box-shadow: rgba(0, 0, 0, 0.2) 0 1px 2px !important;
    }

    /deep/ .dropdown-images {
        display: none;
    }

    #message-settings {
        padding: 10px;

        .message-settings-head {
            > h3 {
                font-size: 14px;
                margin: 0;
            }
        }

        .message-settings-operation {
            margin: 10px 0 10px 10px;
        }

        /deep/ .el-dialog {
            min-width: 850px;
            margin-top: 8vh !important;
        }

        /deep/ .el-dialog__body {
            position: relative;
        }

    }

    .select-cj {
        min-width: 300px;
    }

    .select-fs {
        min-width: 108px;
    }

    .switch-qy {
        width: 105px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 41px;
        right: 20px;
    }

    .tinymce-i18n-box {
        overflow-x: scroll;
        .tinymce-i18n {
            min-width: 810px;
            padding-right: 2px;
        }
    }

    .tool-btns {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
