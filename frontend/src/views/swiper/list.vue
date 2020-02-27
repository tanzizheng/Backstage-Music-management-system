<template>
  <div>
    <div>
      <el-upload
        v-loading="loading1"
        class="upload-demo"
        action="http://localhost:3000/swiper/upload"
        :on-success="uploadSuccess"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">图片上传</el-button>
        <i class="el-icon-plus" />
      </el-upload>
    </div>
    <el-table v-loading="loading" :data="swiperList" stripe>
      <el-table-column type="index" label="#" width="50" />
      <el-table-column label="图片" style="width:90%">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="50">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定删除图片吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/swiper'
export default {
  data() {
    return {
      dialogVisible: false, // 显示吗
      swiper: {}, // 用来做删除功能的参数传递
      swiperList: [], // 存放轮播图信息
      loading: false, // 是否正在加载
      loading1: false // 是否正在加载
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 1.1删除图
    onDel(row) {
      this.swiper = row
      // console.log(this.swiper)
      this.dialogVisible = true
    },
    // 1.2
    doDel() {
      console.log("进一")
      this.dialogVisible = false
      this.loading = true
      console.log(this.swiper)
      del(this.swiper)
        .then(res => {
          this.loading = false
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取轮播图
    getList() {
      this.loading = true
      fetchList().then(res => {
        console.log(res)
        this.swiperList = res.data
        this.loading = false
      })
    },
    uploadSuccess(res) {
      this.loading1 = true
      if (res.id_list.length > 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.getList()
        this.loading1 = false
      }
    }
  }
}
</script>

<style>
</style>
