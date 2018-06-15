<template>
  <div id="app">
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1"><router-link to="bezierSpeedLine">bezierSpeedLine</router-link></el-menu-item>
    <el-menu-item index="2"><router-link to="drawBezierCurve">drawBezierCurve</router-link></el-menu-item>
    <el-menu-item index="3"><router-link to="pointsToSmoothLine">pointsToSmoothLine</router-link></el-menu-item>
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
