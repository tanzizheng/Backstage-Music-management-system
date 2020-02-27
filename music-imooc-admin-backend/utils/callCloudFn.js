// #####--------------调用云函数方法-------------###########

// 引入读取凭证文件
const getAccessToken = require('./getAccessToken.js')
// 引入请求方法模块
const rp = require('request-promise')
const callCloudFn = async (ctx, fnName, params) => {
  const ACCESS_TOKEN = await getAccessToken()
  const options = {
    method: 'POST',
    url: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${fnName}`,
    body: {
      ...params//传递的参数都放到这个对象里面
    },
    json: true
  }
  return await rp(options).then(res => {

    return res
  }).catch(function (err) {
    console.log(err)
  })
}

module.exports = callCloudFn