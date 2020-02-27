// #####--------------调用云存储方法-------------###########
// 引入读取凭证文件
const getAccessToken = require('./getAccessToken.js')
// 引入请求方法模块
const rp = require('request-promise')
// 引入文件读取模块
const fs = require('fs')
// 把所有的方法都封装在一个对象里面
const cloudStorage = {
  // 下载轮播图功能
  async download (ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
      body: {
        env: ctx.state.env,
        file_list: fileList
      },
      json: true
    }
    return await rp(options).then(res => {
      return res
    }).catch(function (err) {
      console.log(err)
    })
  },
  // 上传轮播图功能
  // 1.1
  async upload (ctx) {
    const ACCESS_TOKEN = await getAccessToken()
    const file = ctx.request.files.file
    const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
    const options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
      body: {
        path,
        env: ctx.state.env
      },
      json: true
    }
    const info =await rp(options).then(res => {
      return res
    }).catch(err => {
      console.log(err)
    })
    // console.log(info)
    // 1.2需拼装一个 HTTP POST 请求
    const params = {
      method: 'POST',
      // 1.3;Body 部分格式为 multipart/form-data
      headers: {
        'Content-Type':'multipart/form-data'
      },
      uri: info.url,
      // form表单
      formData: {
        key: path,
        Signature: info.authorization,
        'x-cos-security-token': info.token,
        'x-cos-meta-fileid': info.cos_file_id,
        file: fs.createReadStream(file.path)//读取二进制内容
      },
      json: true
    }
    // 没有返回值
    await rp(params)//发送请求
    // 返回file_id,后面用到
    return info.file_id
  },
  // 删除云存储文件功能
  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
      body: {
        env: ctx.state.env,
        fileid_list: fileid_list
      },
      json: true
    }
    return await rp(options).then(res => {
      return res
    }).catch(function (err) {
      console.log(err)
    })
  }
}







module.exports = cloudStorage