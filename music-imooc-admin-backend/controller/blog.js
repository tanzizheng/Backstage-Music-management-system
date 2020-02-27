// ####################--------博客--------------##############
const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')
// 获取博客列表
router.get('/list', async(ctx, next) => {
  // 通过上下文获取前端传过来的数据
  const params = ctx.request.query  //get 请求
  // 创建数据库语句
  const query = `
    db.collection('blog').skip(${params.start}).limit(${params.count}).orderBy('createTime', 'desc').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
      code: 20000,
      data: res.data
    }
})
// 删除博客列表
router.post('/del', async(ctx, next) => {
  const params = ctx.request.body   // post请求
  // 1.1删除blog信息(博客信息)
  const queryBlog = `db.collection('blog').doc('${params._id}').remove()`
  const delBlogRes =await callCloudDB(ctx, 'databasedelete', queryBlog)
  // 1.2删除blog-comment(评论信息)
  const queryComment = `db.collection('blog-comment').where({
    blogId: '${params._id}'
  }).remove()`
  const delCommentRes =await callCloudDB(ctx, 'databasedelete', queryComment)
  // 1.3删除云存储的博客对应的图片
  const delStorageRes = await cloudStorage.delete(ctx, params.img)
  ctx.body = {
    code: 20000,
    data: {
      delBlogRes,
      delCommentRes,
      delStorageRes
    }
  }
})



module.exports = router
