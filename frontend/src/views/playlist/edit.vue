<template>
  <div>
    <el-form ref="form" :model="playlist" label-width="80px">
      <el-form-item label="歌单名称">
        <el-input v-model="playlist.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="playlist.copywriter" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchById, update } from '@/api/playlist'
export default {
  data() {
    return {
      playlist: {} // 歌单信息
    }
  },
  // vue创建后
  created() {
    // 获取歌单列表
    fetchById({
      id: this.$route.params.id
    }).then(res => {
      console.log(res)
      this.playlist = res.data
    })
  },
  methods: {
    // 编辑歌曲
    onSubmit() {
      update(this.playlist).then(res => {
        if (res.data.modified > 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        } else {
          this.$message.error('更新失败')
        }
        // 跳转到列表界面
        this.$router.push('/playlist/list')
      })
    },
    // 取消
    onCancel() {
      // 跳转到列表界面
      this.$router.push('/playlist/list')
    }
  }
}
</script>

<style>
</style>
