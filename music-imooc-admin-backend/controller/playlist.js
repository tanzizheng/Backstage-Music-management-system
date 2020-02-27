// ##############-----------歌曲列表方法----------------###########
// 引入koa路由
const Router = require('koa-router')
// 创建实例化对象
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB')

// 获取歌单列表信息
router.get('/list', async (ctx, next) => {
  // 触发云函数
  // 1.1如果前端通过get请求发送参数的话,可以通过这种方式获取
  const query = ctx.request.query
  // 调用方法获取数据
  const res = await callCloudFn(ctx, 'music', {
    $url: 'playlist',
    //    1.2是要通过这个属性query获取
    start: parseInt(query.start),//开始取的条数的位置
    count: parseInt(query.count),//每次取的条数
  })
  // 前端模板要求返回格式
  let data = []
  if (res.resp_data) {
    data = JSON.parse(res.resp_data).data
  }
  ctx.body = {
    data,
    code: 20000
  }
})
// 歌曲编辑
router.get('/getById', async (ctx, next) => {
  const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
  const res = await callCloudDB(ctx, 'databasequery', query)
  ctx.body = {
    code: 20000,
    data: JSON.parse(res.data)
  }
})
// 更新歌曲updatePlaylist
router.post('/updatePlaylist', async (ctx, next) => {
  // 接收前端传过来的参数
  const params = ctx.request.body
  const query = `
  db.collection('playlist').doc('${params._id}').update({
    data: {
      name: '${params.name}',
      copywriter: '${params.copywriter}'
    }
  })`
  const res = await callCloudDB(ctx, 'databaseupdate', query)
  ctx.body = {
    code: 20000,
    data: res
  }
})
// 删除
router.get('/del', async (ctx, next) => {
  // 接收前端传过来的参数
  const params = ctx.request.query
  // 创建数据库语句
  const query = `db.collection('playlist').doc('${params.id}').remove()`
  const res = await callCloudDB(ctx, 'databasedelete', query)
  ctx.body = {
    code: 20000,
    data: res
  }
})



// 导出
module.exports = router