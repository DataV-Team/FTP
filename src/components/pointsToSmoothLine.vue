<template>
  <div id="points-to-smooth-line">
    <div class="action">
      <div class="re-paint">RePaint</div>
      <div class="k-value">
        k:
        <input type="text" placeholder="K">
      </div>
    </div>
    <canvas
      id="points-to-smooth-line-canvas"
      @mousedown="handleMouseDown"/>
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
      },
      // 绘制数据
      drawData: [],
      // 曲线是否闭合
      lineClosedStatus: false,
      // 增强
      enhance: {
        // 绘制点的显示状态
        pointsStatus: true,
        // 直线的显示状态
        beelinesStatus: true,
        // 曲线的显示状态
        curvesStatus: true
      },
      // 颜色
      color: {
        // 绘制点颜色
        pointsColor: '#f06183',
        // 直线颜色
        beelinesColor: '#00a1e4',
        // 曲线颜色
        curvesColor: '#69d2cd'
      },

      // 配置项

      // 球点半径
      pointsRadius: 15,
      // 线条宽度
      lineWidth: 3
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
    },
    /**
     * @description         初始化canvas及必要数据
     * @return  {undefined} 无返回值
     */
    handleMouseDown ({ offsetX, offsetY }) {
      const { drawData, draw } = this

      drawData.push({x: offsetX * 2, y: offsetY * 2})

      draw()
    },
    /**
     * @description         绘制曲线
     * @return  {undefined} 无返回值
     */
    draw () {
      const { drawPoints, drawBeelines, drawCurveLines } = this

      drawPoints()

      drawBeelines()

      drawCurveLines()
    },
    /**
     * @description         绘制 绘制点
     * @return  {undefined} 无返回值
     */
    drawPoints () {
      const { drawData, drawPoint, pointsRadius, color: { pointsColor } } = this

      drawData.map(({ x, y }) => {
        const point = { x, y, radius: pointsRadius, color: pointsColor }

        drawPoint(point)
      })
    },
    /**
     * @description         绘制原点
     * @param   {Object}    绘制点的信息
     * @param           {x, y}   绘制球点坐标位置
     * @param           {radius} 球点半径
     * @param           {color}  球点颜色
     * @return  {undefined} 无返回值
     */
    drawPoint ({x = 0, y = 0, radius = 10, color = '#000'}) {
      const { ctx } = this

      console.error(radius)

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.closePath()

      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.fill()
      ctx.stroke()
    },
    /**
     * @description         绘制 点连线
     * @return  {undefined} 无返回值
     */
    drawBeelines () {
      const { drawData, drawBeeline, lineWidth } = this

      drawData.map((point, index) => {

      })
    },
    /**
     * @description         绘制 点连线
     * @param   {Object}    起始 终止 点数据
     * @param           {x, y}   绘制球点坐标位置
     * @param   {Int}       线条宽度
     * @param   {String}    线条颜色
     * @return  {undefined} 无返回值
     */
    drawCurveLine (lineBegin, lineEnd, lineWidth = 3, lineColor = '#000') {
      const { ctx } = this

      ctx.beginPath()

      let { x, y } = lineBegin

      ctx.moveTo(x, y)



      ctx.closePath()


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
