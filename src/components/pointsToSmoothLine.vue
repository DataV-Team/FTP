<template>
  <div id="points-to-smooth-line">
    <div class="action">
      <div @click="reDraw">reDraw</div>
      <input type="text" placeholder="K">
      <div :class="{red: enhance.pointsStatus}"
        @click="changeDrawStatus('pointsStatus')">Points</div>
      <div :class="{red: enhance.beelinesStatus}"
        @click="changeDrawStatus('beelinesStatus')">beeline</div>
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
     * @description         处理鼠标点下事件
     * @return  {undefined} 无返回值
     */
    handleMouseDown ({ offsetX, offsetY }) {
      const { lineClosedStatus, drawData, draw } = this

      if (lineClosedStatus) return false

      const { x, y } = { x: offsetX * 2, y: offsetY * 2 }

      const { calcPointIsInCircle, pointsRadius } = this

      drawData.push({ x, y })

      drawData.length > 2 &&
        calcPointIsInCircle(drawData[0], { x, y, radius: pointsRadius }) &&
        drawData.splice(drawData.length - 1, 1) &&
        (this.lineClosedStatus = true)

      draw()
    },
    /**
     * @description        计算点是否在圆内
     * @return  {Boolean}  计算结果 在圆内 为 true 否则 false
     */
    calcPointIsInCircle (point, circle) {
      const { calcTwoPointsDistance } = this

      const { radius } = circle

      const distance = calcTwoPointsDistance(point, circle)

      return distance < radius
    },
    /**
     * @description         计算两点间距离
     * @param   {Object}    起始 终止 点数据
     * @param           {x, y}   球点坐标位置
     * @return  {int}       两点间距离
     */
    calcTwoPointsDistance (pointBeing, pointEnd) {
      const { sqrt, pow, abs } = Math

      const { x: bx, y: by } = pointBeing
      const { x: ex, y: ey } = pointEnd

      const absX = abs(bx - ex)
      const absY = abs(by - ey)

      return sqrt(pow(absX, 2) + pow(absY, 2))
    },
    /**
     * @description         绘制曲线
     * @return  {undefined} 无返回值
     */
    draw () {
      const { ctx, canvasWH, drawPoints, drawBeelines, drawCurveLines, enhance } = this

      ctx.clearRect(0, 0, canvasWH.width, canvasWH.height)

      const { pointsStatus, beelinesStatus, curvesStatus } = enhance

      pointsStatus && drawPoints()

      beelinesStatus && drawBeelines()

      curvesStatus && drawCurveLines()
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
      const { drawData, drawBeeline } = this

      const { lineWidth, color: { beelinesColor } } = this

      const { length: pointsNum } = drawData

      drawData.map((point, index) => {
        if (index === pointsNum - 1) return false

        const lineBegin = point
        const lineEnd = drawData[index + 1]

        drawBeeline(lineBegin, lineEnd, lineWidth, beelinesColor)
      })

      const { lineClosedStatus } = this

      lineClosedStatus && drawBeeline(drawData[pointsNum - 1], drawData[0], lineWidth, beelinesColor)
    },
    /**
     * @description         绘制 点连线
     * @param   {Object}    起始 终止 点数据
     * @param           {x, y}   绘制球点坐标位置
     * @param   {Int}       线条宽度
     * @param   {String}    线条颜色
     * @return  {undefined} 无返回值
     */
    drawBeeline (lineBegin, lineEnd, lineWidth = 3, lineColor = '#000') {
      const { ctx } = this

      ctx.beginPath()

      {
        const { x, y } = lineBegin
        ctx.moveTo(x, y)
      }

      {
        const { x, y } = lineEnd
        ctx.lineTo(x, y)
      }

      ctx.closePath()

      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor
      ctx.stroke()
    },
    drawCurveLines () {
    },
    /**
     * @description          重新绘制
     * @return  {undefined}  无返回值
     */
    reDraw () {
      const { draw } = this

      this.drawData = []

      this.lineClosedStatus = false

      draw()
    },
    /**
     * @description          切换绘制元素显示与隐藏状态
     * @param   {string}     切换的元素状态键值
     * @return  {undefined}  无返回值
     */
    changeDrawStatus (key) {
      const { enhance, draw } = this

      enhance[key] = !enhance[key]

      draw()
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

  .red {
    color: #f06183;
  }

  .action {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 50px;
    font-size: 20px;
    box-shadow: 0 0 3px red;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    line-height: 50px;

    & > div, & > input {
      width: 100px;
      text-align: center;
      box-shadow: 0 0 3px gray;
    }

    div {
      cursor: pointer;
    }

    input {
      border: 0px;

      &::-webkit-input-placeholder {
        font-size: 20px;
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
