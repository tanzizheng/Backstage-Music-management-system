// ##############-----------轮播图方法----------------###########
// 1.1引入koa路由
const Router = require('koa-router')
// 1.2创建实例化对象
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')
// 获取轮播图功能
router.get('/list', async(ctx, next) => {
  const query = `db.collection('swiper').get()`
  const res = await callCloudDB(ctx, 'databasequery', query)
  // console.log(res)
  // 文件下载链接
  // 1.1创建第二个参数,组数对象
  let fileList = []
  const data = res.data
  // 1.2拿到文件id
  for (let i=0,len = data.length;i<len;i++) {
    fileList.push({
      fileid: JSON.parse(data[i]).fileid,//把数组字符串转换成对象再拿值
      max_age: 7200
    })
  }
  // 得到图片下载链接
  const dlRes = await cloudStorage.download(ctx, fileList)
  // console.log(dlRes)
  let returnData = [] // 用来保存图片云url,下载url和云_id
  for (let i=0,len=dlRes.file_list.length;i<len;i++) {
    returnData.push({
      download_url: dlRes.file_list[i].download_url,
      fileid: dlRes.file_list[i].fileid,
      _id: JSON.parse(data[i])._id
    })
  }
  ctx.body = {
    code: 20000,
    data: returnData
  }
})
// 图片上传功能
router.post('/upload', async(ctx, next) => {
  // 1.1
  const fileid = await cloudStorage.upload(ctx)
  // console.log(fileid)
  // 1.2写入数据库
  const query = `
    db.collection('swiper').add({
      data: {
        fileid: '${fileid}'
      }
    })`
  const res = await callCloudDB(ctx, 'databaseadd', query)
  ctx.body = {
    code: 20000,
    id_list: res.id_list
  }
})

// 图片删除功能
router.get('/del', async(ctx, next) => {
  console.log('进1')
  // 1.1删除数据库内容
  const params = ctx.request.query
  const query = `db.collection('swiper').doc('${params._id}').remove()`
  const delDBRes = await callCloudDB(ctx, 'databasedelete',query)
  // 1.2删除云存储文件
  const delStorangeRes = await cloudStorage.delete(ctx, [params.fileid])
  
  ctx.body = {
    code: 20000,
    data: {
      delDBRes,
      delStorangeRes
    }
  }
})
// 导出
module.exports = router