// 引入路由优化包
const rp = require('request-promise')
// 引入读写文件模块
const fs = require('fs')
// 引入路径模块
const path = require('path')
// 当前文件的绝对路径+文件名
const fileName = path.resolve(__dirname, './access_token.json')
const APPSECRET = '3149b57393f8ca8e1ee4ba668f9061fe'
const APPID = 'wxea42725e75156672'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const  updateAccessToken = async () => {
    const resStr = await rp(URL)
    const res=JSON.parse(resStr)
 
    // 保存后台接口调用凭据
    if (res.access_token) {
        // 同步写入文件
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,//凭证
            createTime: new Date(),//当前时间
        }))
    } else {
        await updateAccessToken()
    }
}
// 获取凭证
const getAccessToken = async () => {
    try {
        // 以utf8方式读取文件
        const readRes = fs.readFileSync(fileName, 'utf8')
        //    转化成对象
        const readObj = JSON.parse(readRes)
        // 判断是否在规定的时间内凭证是否一致(超过两小时)
        const createTime=new Date(readObj.createTime).getTime()
        // 当前时间
        const nowTime=new Date().getTime()
        if((nowTime- createTime)/1000/60/60>=2){
           await updateAccessToken()
           await getAccessToken()
        }
        const res=readObj.access_token
        return res
    } catch (e) {
        await updateAccessToken()
        await getAccessToken()
    }


}
// 开启定时器
setInterval(async()=>{
    await updateAccessToken()
},(7200-300)*1000)
// updateAccessToken()
// getAccessToken()

module.exports = getAccessToken
