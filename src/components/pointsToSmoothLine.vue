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
    /**
     * @description         初始化canvas及必要数据
     * @return  {undefined} 无返回值
     */
    initData () {
      const { canvasWH } = this

      this.canvas = document.querySelector('#points-to-smooth-line-canvas')
      this.ctx = this.canvas.getContext('2d')

      // 获取canvasDOM宽高 并放大两倍 减少画面模糊
      canvasWH.width = this.canvas.clientWidth * 2
      canvasWH.height = this.canvas.clientHeight * 2

      // 设置canvas绘制区域大小
      this.canvas.setAttribute('width', canvasWH.width)
      this.canvas.setAttribute('height', canvasWH.height)
    }
  },
  mounted () {
    this.initData()
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
