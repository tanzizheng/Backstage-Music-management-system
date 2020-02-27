// ##############-------------------轮播图方法-------------------##########
// 请求包
import request from '@/utils/request'
const baseURL = 'http://localhost:3000'
// 获取图片功能
export function fetchList() {
  return request({
    url: `${baseURL}/swiper/list`,
    method: 'get'
  })
}
// 删除图片功能
export function del(params) {
  const data = request({
    params,
    url: `${baseURL}/swiper/del`,
    method: 'get'
  })
  console.log('进二=')
  console.log(data)
  return data
}
