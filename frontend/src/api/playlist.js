// ##############-------------------歌单方法-------------------##########
import request from '@/utils/request'

const baseURL = 'http://localhost:3000'
// 获取歌单列表信息
export function fetchList(params) {
  return request({
    params,
    url: `${baseURL}/playlist/list`, // 定义接口
    method: 'get'
  })
}
// 歌曲编辑
export function fetchById(params) {
  return request({
    params,
    url: `${baseURL}/playlist/getById`, // 定义接口
    method: 'get'
  })
}
// 更新歌曲
export function update(params) {
  return request({
    url: `${baseURL}/playlist/updatePlaylist`,
    data: {
      ...params
    },
    method: 'post'
  })
}
// 歌曲删除
export function del(params) {
  return request({
    params,
    url: `${baseURL}/playlist/del`, // 定义接口
    method: 'get'
  })
}
