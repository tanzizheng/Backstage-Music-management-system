const Koa=require('koa')
const app=new Koa()
// 引入koa路由
const Router=require('koa-router')
// 创建实例化对象
const router=new Router()
// 跨域模块
const cors= require('koa2-cors')
// 引入post请求解析插件
const koaBody = require('koa-body')
// 云环境id
const ENV='xyj-8tttu'
// 允许前端接口访问
app.use(cors({
    origin:['http://localhost:9528'],
    // 证书
    credentials:true
}))
// 接收post参数解析
app.use(koaBody({
    multipart:true//这里补充一点，如果不加multipart：true ctx.request.body会获取不到值
}))
// 全局中间件
app.use(async (ctx,next)=>{
    // console.log("全局中间件")
    ctx.state.env = ENV
    //再 进入其他的路由
    await next()
})
// 1.1导入音乐列表路由中间件
const playlist=require('./controller/playlist.js')
// 1.1导入轮播图中间件
const swiper=require('./controller/swiper.js')
// 1.1导入博客中间件
const blog=require('./controller/blog.js')
// 1.2allowedMethods 应用场景
// 1.2把当前路由声明router的routes声明(二级路由)注册成中间件
router.use('/playlist',playlist.routes())
router.use('/swiper',swiper.routes())
router.use('/blog', blog.routes())
app.use(router.routes())
// 1.3允许方法的使用(get,post)
app.use(router.allowedMethods())

// 监听端口号
app.listen(3000,()=>{
    console.log('服务开启在3000端口号')
})