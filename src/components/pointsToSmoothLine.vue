<template>
  <div id="points-to-smooth-line">
    <div class="action">
      <div class="re-paint">RePaint</div>
      <div class="k-value">
        k:
        <input type="text" placeholder="K">
      </div>
    </div>
    <canvas id="points-to-smooth-line-canvas"></canvas>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // canvas DOM元素
      canvas: {},
      // canvas 绘制句柄
      ctx: {},
      // canvas宽高
      canvasWH: {
        width: 0,
        height: 0
      }
    }
  },
  methods: {

  },
  created () {

    let lineSpeedBox = document.querySelector('.line-speed')

    let speedItem = document.querySelector('#speed-item')

    let canvas = document.querySelector('#bezier-speed-line')
    let ctx = canvas.getContext('2d')

    vm.lineSpeedBox = lineSpeedBox
    vm.speedItem = speedItem

    vm.canvas = canvas
    vm.ctx = ctx

    // 获取canvasDOM宽高 并放大两倍 减少画面模糊
    let width = canvas.clientWidth * 2
    let height = canvas.clientHeight * 2
  }
}
</script>

<style lang="less">
#points-to-smooth-line {
  width: 100%;
  height: calc(~"100% - 70px");

  .action {
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 260px;
    height: 50px;
    font-size: 20px;

    .re-paint {
      float: left;
      width: 80px;
      height: 50px;
      box-shadow: 0 0 3px gray;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
    }

    .k-value {
      float: left;
      margin-left: 100px;
      line-height: 50px;

      input {
        display: block;
        float: right;
        box-sizing: border-box;
        width: 50px;
        height: 50px;
        text-align: center;
      }
    }
  }

  #points-to-smooth-line-canvas {
    width: 100%;
    height: calc(~"100% - 70px");
    box-shadow: 0 0 3px gray;
  }
}
</style>
