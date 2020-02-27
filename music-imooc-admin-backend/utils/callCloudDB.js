// #####--------------调用云数据库方法-------------###########
// 引入读取凭证文件
const getAccessToken = require('./getAccessToken.js')
// 引入请求方法模块
const rp = require('request-promise')
const callCloudDB = async (ctx, fnName, query = {}) => {//query = {}查询条件
  const ACCESS_TOKEN = await getAccessToken()
 
  const options = {
    method: 'POST',
    url: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
    body: {
      query,
      env: ctx.state.env
    },
    json: true
  }
  return await rp(options).then(res => {
    return res
  }).catch(function (err) {
    console.log(err)
  })
}



module.exports = callCloudDB