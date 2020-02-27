<template>
  <div>
    <el-table v-loading="loading" :data="playlist" stripe>
      <el-table-column type="index" label="#" width="50" />
      <el-table-column label="封面" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt height="50">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="copywriter" label="描述" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定删除此歌曲吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/playlist'
import scroll from '@/utils/scroll'
export default {
  data() {
    return {
      info: {}, // 保存要删除的歌曲ID
      dialogVisible: false, // 删除
      playlist: [],
      count: 12, // 条数
      loading: false // 是否正在加载
    }
  },
  // 页面创建完成后
  created() {
    this.getList()
  },
  // dom(页面)载入后
  mounted() {
    scroll.start(this.getList)
  },
  methods: {
    // 1.1删除
    onDel(row) {
      this.dialogVisible = true
      this.info.id = row._id
    },
    // 1.2删除
    doDel() {
      del({ id: this.info.id }).then(res => {
        if (res.data.deleted > 0) {
          this.dialogVisible = false
          this.playlist = []
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.dialogVisible = false
          this.$message.error('删除失败')
        }
      })
    },
    getList() {
      this.loading = true
      fetchList({
        start: this.playlist.length,
        count: this.count // 取的条数
      }).then(res => {
        console.log(res)
        // 追加列表的数据
        this.playlist = this.playlist.concat(res.data)
        // 如果每次取的条数小于指定取的条数,则说明数据取完
        if (res.data.length < this.count) {
          // 停获取数据
          scroll.end()
        }
        this.loading = false
      })
    },
    onEdit(row) {
      this.$router.push(`/playlist/edit/${row._id}`)
    }
  }
}
</script>

<style>
</style>
