<template>
  <div id="app">
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1"><router-link to="BezierSpeedLine">BezierSpeedLine</router-link></el-menu-item>
  </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
</style>
