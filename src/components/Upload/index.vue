<template>
    <div>
        <el-upload
            class="upload-box"
            :accept="accept"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :drag="drag"
            :http-request="uploadSectionFile"
            multiple
            :limit="limit"
            :on-exceed="handleExceed"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :file-list="fileList">
            <el-button size="small" type="primary" v-if="!drag" :disabled="disabled">点击上传</el-button>
            <i class="el-icon-upload" v-if="drag"></i>
            <div class="el-upload__text" v-if="drag">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" v-if="!noPrompt && (accept.includes('.jpg') || accept.includes('.pdf'))" class="el-upload__tip">文件格式仅支持：{{accept}}，单文件大小不超过5MB，文件数量不超过{{limit}}个</div>
            <div slot="tip" v-if="!noPrompt && accept.includes('.mp4')" class="el-upload__tip">视频格式仅支持：{{accept}}，单文件大小不超过50MB，文件数量不超过{{limit}}个</div>
            <div slot="tip" v-if="!noPrompt && accept === '*'" class="el-upload__tip">文件格式不限，单文件大小不超过100MB，文件数量不超过{{limit}}个</div>
        </el-upload>
        <el-dialog
            title="预览"
            :visible.sync="dialogVisible"
            width="40%">
            <img v-if="showPhoto" :src="previewUrl" class="preview-img" alt="">
            <video v-if="showVideo" :src="previewUrl" class="preview-img" controls></video>
        </el-dialog>
    </div>
</template>

<script>
    import service from '@/utils/request'

    export default {
        props: {
            // 是否支持拖拽
            drag: {
                type: Boolean,
                default: false
            },
            // 文件列表
            fileList: {
                type: Array
            },
            // 最大数量
            limit: {
                type: Number,
                default: 999
            },
            // 格式限制 .jpg, .png, .pdf, .mp4
            accept: {
                type: String,
                default: '*'
            },
            // 禁用
            disabled: {
                type: Boolean,
                default: false
            },
            noPrompt: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                // 显示预览
                dialogVisible: false,
                // 点击的是图片
                showPhoto: false,
                // 点击的是视频
                showVideo: false,
                // 预览路径
                previewUrl: ''
            }
        },
        watch: {
        },
        methods: {
            /**
             *  删除文件前
             */
            beforeRemove (file) {
                return file.status === 'uploading' || file.status === 'ready' ? false : !this.disabled
            },
            // 移除
            handleRemove (file) {
                // 正常移除有file.fileId，上传前被阻止file.raw.uid，上传中被移除file.uid，上传失败file就是uid
                this.$emit('removeFile', file)
            },
            // 点击预览
            handlePreview (file) {
                if (file.status === 'ready' || file.status === 'uploading') {
                    return false
                }
                if (file.type === 0 || file.response.type === 0) {
                    this.showPhoto = true
                    this.showVideo = false
                    this.previewUrl = file.filePath || file.response.filePath
                    this.dialogVisible = true
                } else if (file.name.substring(file.name.length - 4) === '.mp4') {
                    this.showPhoto = false
                    this.showVideo = true
                    this.previewUrl = file.filePath || file.response.filePath
                    this.dialogVisible = true
                } else {
                    window.open(file.filePath || file.response.filePath)
                }
            },
            // 超限制
            handleExceed () {
                if (this.limit) {
                    this.$message.warning(`最多能上传${this.limit}个文件`)
                }
            },
            beforeUpload (file) {
                let size = file.size
                let type = file.type
                return new Promise((resolve, reject) => {
                    if (file.name.length > 104) {
                        this.$message.error('文件名称最大长度为100个字符')
                        return reject(new Error())
                    }
                    if ((type === 'image/jpeg' || type === 'image/png') && size / 1024 / 1024 > 5) {
                        this.$message.error('你只能上传5MB以内的文件')
                        return reject(new Error())
                    }
                    if (type.includes('pdf') && size / 1024 / 1024 > 5) {
                        this.$message.error('你只能上传5MB以内的文件')
                        return reject(new Error())
                    }
                    if (type === 'video/mp4' && size / 1024 / 1024 > 50) {
                        this.$message.error('你只能上传50MB以内的文件')
                        return reject(new Error())
                    }
                    if (size / 1024 / 1024 > 100) {
                        this.$message.error('你只能上传100MB以内的文件')
                        return reject(new Error())
                    }
                    return resolve(Blob)
                })
            },
            /**
             * 自定义上传文件
             * @param params 上传的文件
             */
            uploadSectionFile (params) {
                const file = params.file
                const form = new FormData()
                form.append('file', file)
                form.append('imageType', 0)
                this.$emit('inUploading', {
                    state: true,
                    uid: file.uid
                })
                service.post('/file/upload', form, {
                    headers: {'content-type': 'multipart/form-data'},
                    onUploadProgress: progressEvent => {
                        let percent = (progressEvent.loaded / progressEvent.total * 100) | 0
                        params.onProgress({percent: percent === 100 ? 99 : percent})
                    }
                }).then(res => {
                    params.onProgress({percent: 100})
                    this.$emit('inUploading', {
                        state: false,
                        uid: file.uid
                    })
                    if (res.code.toString() === '0') {
                        let data = {
                            fileId: res.data.imageId || res.data.fileId,
                            name: params.file.name,
                            filePath: '/' + res.data.filePath
                        }
                        if (file.type === 'image/jpeg' || file.type === 'image/png') {
                            data.type = 0
                        } else {
                            data.type = 1
                        }
                        params.onSuccess(data)
                        this.$emit('uploadSuccess', data)
                    } else {
                        this.handleRemove(file.uid)
                    }
                }).catch(() => {
                    this.$emit('inUploading', {
                        state: false,
                        uid: file.uid
                    })
                    this.handleRemove(file.uid)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .upload-box {
        width: 500px;
    }

    /deep/ .el-upload-list__item.is-ready, /deep/ .el-upload-list__item.is-uploading {
        .el-icon-close {
            left: -9999px;
            top: -9999px;
            opacity: 0;
            cursor: default;
        }
    }
</style>
