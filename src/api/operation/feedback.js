import request from '@/utils/request'

// 获取反馈列表
export function getFeedbackList (data) {
    return request({
        url: '/user/email/feedback/list',
        method: 'post',
        data
    })
}

// 确认修改消息状态
export function checkMsgState (data) {
    return request({
        url: '/user/email/feedback/status/update',
        method: 'post',
        data
    })
}
