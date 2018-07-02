<template>
  <div id="app">
  <el-menu class="el-menu-demo" mode="horizontal" router>
    <el-menu-item index="bezierSpeedLine">bezierSpeedLine</el-menu-item>
    <el-menu-item index="drawBezierCurve">drawBezierCurve</el-menu-item>
    <el-menu-item index="pointsToSmoothLine">pointsToSmoothLine</el-menu-item>
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
