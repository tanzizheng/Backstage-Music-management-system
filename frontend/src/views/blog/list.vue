<template>
  <div>
    <el-table v-loading="loading" :data="blogList" stripe>
      <el-table-column type="index" label="#" width="30%" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="nickName" width="80%" label="发布人" />
      <el-table-column width="90%" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定删除此评论吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/blog'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false, // 加载动画
      blogList: [], // 存放博客列表
      count: 6, // 条数
      blog: {} // 博客对象
    }
  },
  created() {
    this.getList()
  },
  // 载入后
  mounted() {
    // 调用下拉加载数据方法,将函数作为参数传递过去
    scroll.start(this.getList)
  },
  methods: {
    // 获取博客列表
    getList() {
      this.loading = true
      fetchList({
        start: this.blogList.length, // 起始位置
        count: this.count
      }).then(res => {
        // console.log(res)
        const data = res.data
        // 将字符串转化为对象
        const _blogList = []
        for (let i = 0, len = data.length; i < len; i++) {
          _blogList.push(JSON.parse(data[i]))
        }
        // 拼接到博客信息组数里面
        this.blogList = this.blogList.concat(_blogList)
        // console.log(this.blogList)
        // 如果返回的查询列表小于固定要查询的条数,说明数据取完,停止下拉加载数据操作
        if (_blogList.length < this.count) {
          scroll.end()
        }
        this.loading = false
      })
    },
    onDel(row) {
      this.blog = row
      this.dialogVisible = true
    },
    doDel() {
      this.dialogVisible = false
      this.loading = true
      // 删除评论
      del(this.blog).then(res => {
        // console.log(res)
        this.loading = false
        if (res.data.delBlogRes.deleted > 0) {
          this.blogList = []
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
