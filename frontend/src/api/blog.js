// ##################--------博客--------------------###############
// 引入发送请求方法
import request from '@/utils/request'

const baseURL = 'http://localhost:3000'
// 请求博客列表
export function fetchList(params) {
  return request({
    url: `${baseURL}/blog/list`,
    method: 'get',
    params: {
      ...params
    }
  })
}
// 删除博客列表
export function del(params) {
  return request({
    url: `${baseURL}/blog/del`,
    data: {
      ...params
    },
    method: 'post'
  })
}
