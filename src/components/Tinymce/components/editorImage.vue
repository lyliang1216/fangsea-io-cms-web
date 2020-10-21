<template>
    <div class="upload-container">
        <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary"
                   @click="dialogVisible=true">
            上传图片
        </el-button>
        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <el-upload
                :multiple="true"
                :file-list="fileList"
                :show-file-list="true"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                class="editor-slide-upload"
                :action="action"
                list-type="picture-card">
                <el-button size="small" type="primary">
                    点击上传
                </el-button>
            </el-upload>
            <el-button size="small" @click="handleCancel">
                取 消
            </el-button>
            <el-button size="small" type="primary" @click="handleSubmit">
                确 定
            </el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'EditorSlideUpload',
        props: {
            color: {
                type: String,
                default: '#1890ff'
            }
        },
        data () {
            return {
                dialogVisible: false,
                listObj: {},
                fileList: [],
                action: '/api/v2/file/upload'
            }
        },
        methods: {
            // 是否全部上传成功
            checkAllSuccess () {
                return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
            },
            // 取消
            handleCancel () {
                this.listObj = {}
                this.fileList = []
                this.dialogVisible = false
            },
            // 确定/提交
            handleSubmit () {
                const arr = Object.keys(this.listObj).map(v => this.listObj[v])
                if (!this.checkAllSuccess()) {
                    this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
                    return
                }
                this.$emit('successCBK', arr)
                this.listObj = {}
                this.fileList = []
                this.dialogVisible = false
            },
            // 上传成功
            handleSuccess (response, file) {
                const uid = file.uid
                const objKeyArr = Object.keys(this.listObj)
                for (let i = 0, len = objKeyArr.length; i < len; i++) {
                    if (this.listObj[objKeyArr[i]].uid === uid) {
                        this.listObj[objKeyArr[i]].url = response.data.filePath
                        this.listObj[objKeyArr[i]].hasSuccess = true
                        return
                    }
                }
            },
            // 删除
            handleRemove (file) {
                const uid = file.uid
                const objKeyArr = Object.keys(this.listObj)
                for (let i = 0, len = objKeyArr.length; i < len; i++) {
                    if (this.listObj[objKeyArr[i]].uid === uid) {
                        delete this.listObj[objKeyArr[i]]
                        return
                    }
                }
            },
            // 上传前
            beforeUpload (file) {
                const _self = this
                const _URL = window.URL || window.webkitURL
                const fileName = file.uid
                this.listObj[fileName] = {}
                return new Promise((resolve, reject) => {
                    const isJPEG = file.type === 'image/jpeg'
                    const isPNG = file.type === 'image/png'
                    if (!isJPEG && !isPNG) {
                        this.$message.error('你只能上传jpg或png格式图片')
                        return reject(new Error())
                    }
                    const img = new Image()
                    img.src = _URL.createObjectURL(file)
                    img.onload = function () {
                        _self.listObj[fileName] = {
                            hasSuccess: false,
                            uid: file.uid,
                            width: this.width,
                            height: this.height
                        }
                    }
                    resolve(true)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .editor-slide-upload {
        margin-bottom: 20px;
        /deep/ .el-upload--picture-card {
            width: 100%;
        }
    }
</style>
