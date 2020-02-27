// ##############--------下拉刷新加载功能--------##############
const scroll = {
  isEnd: false,
  start(callback) {
    let timer = null
    // 加事件句柄
    callback && window.addEventListener('scroll', () => {
      if (timer) {
        clearTimeout(timer)
      }
      // 防抖节流
      timer = setTimeout(() => {
        // 浏览器向上滚动的页面总高度(鼠标向上滚的那段)//滚走的距离(标准模式和混杂模式)
        const scrollTop = Math.ceil(document.documentElement.scrollTop || document.body.scrollTop)
        // console.log('上滚动的页面总高度=', scrollTop)
        // 文档的真实高度
        const scrollHeight = document.documentElement.scrollHeight
        // console.log('文档的真实高度=', scrollHeight)
        // 浏览器窗口(文档)的可视高度,就是肉眼可见的那部分全屏高度(标准模式和混杂模式)
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        // console.log('可视高度=', clientHeight)
        if (!this.isEnd && scrollHeight === scrollTop + clientHeight) {
          // 把内容滚动到指定的坐标
          window.scrollTo(0, scrollTop - 100)
          // 请求数据
          callback()
        }
      }, 300)
    })
  },
  // 当到达底部没有数据加载时
  end() {
    this.isEnd = true
  }
}
// 抛出
export default scroll
