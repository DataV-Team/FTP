<template>
  <div id="points-to-smooth-line">
    <div class="action">
      <div class="red" @click="reDraw">reDraw</div>
      <input type="text" placeholder="K">
      <div :class="{red: enhance.pointsStatus}"
        @click="changeDrawStatus('pointsStatus')">Points</div>
      <div :class="{red: enhance.beelinesStatus}"
        @click="changeDrawStatus('beelinesStatus')">beeline</div>
      <div :class="{red: enhance.linesMiddlePointsStatus}"
        @click="changeDrawStatus('linesMiddlePointsStatus')">LMP</div>
      <div :class="{red: enhance.middlePointsLinesStatus}"
        @click="changeDrawStatus('middlePointsLinesStatus')">MPL</div>
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
        curvesStatus: true,
        // 绘制点中点的显示状态
        linesMiddlePointsStatus: true,
        // 绘制点中点连线显示状态
        middlePointsLinesStatus: true
      },
      // 颜色
      color: {
        // 绘制点颜色 红色
        pointsColor: '#f06183',
        // 直线颜色 蓝色
        beelinesColor: '#00a1e4',
        // 绘制点连线中点颜色 绿色
        linesMiddlePointsColor: '#69d2cd',
        // 绘制点连线中点连线颜色 黄色
        middlePointsLinesColor: '#fed368',
        // 曲线颜色 绿色
        curvesColor: '#69d2cd'
      },

      // 配置项

      // 球点半径
      pointsRadius: 15,
      // 中点球点半径
      middlePointsRadius: 7,
      // 线条宽度
      lineWidth: 3
    }
  },
  methods: {
    /**
     * @description             初始化canvas及必要数据
     * @return     {undefined}  无返回值
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
     * @description                      处理鼠标点下事件
     * @param      {{offsetX, offsetY}}  点击事件的坐标 {Object}
     * @return     {undefined}           无返回值
     */
    handleMouseDown ({ offsetX, offsetY }) {
      const { lineClosedStatus, drawData, draw } = this

      if (lineClosedStatus) return false

      const { x, y } = { x: offsetX * 2, y: offsetY * 2 }

      const { calcPointIsInCircle, pointsRadius } = this

      drawData.push({ x, y })

      const { length: pointsNum } = drawData

      pointsNum > 2 &&
        calcPointIsInCircle(drawData[0], { x, y, radius: pointsRadius }) &&
        drawData.splice(pointsNum - 1, 1) &&
        (this.lineClosedStatus = true)

      draw()
    },
    /**
     * @description                  计算点是否在圆内
     * @param      {{x, y}}          点击点位置 {Object}
     * @param      {{x, y, radius}}  圆的圆心位置与半径 {Object}
     * @return     {Boolean}         计算结果 在圆内 为 true 否则 false
     */
    calcPointIsInCircle (point, circle) {
      const { calcTwoPointsDistance } = this

      const { radius } = circle

      const distance = calcTwoPointsDistance(point, circle)

      return distance < radius
    },
    /**
     * @description          计算两点间距离
     * @param      {{x, y}}  起始球点坐标位置
     * @param      {{x, y}}  终止球点坐标位置
     * @return     {int}     两点间距离
     */
    calcTwoPointsDistance ({x: bx, y: by}, {x: ex, y: ey}) {
      const { sqrt, pow, abs } = Math

      const absX = abs(bx - ex)
      const absY = abs(by - ey)

      return sqrt(pow(absX, 2) + pow(absY, 2))
    },
    /**
     * @description            绘制曲线
     * @return     {undefined} 无返回值
     */
    draw () {
      // 方法
      const { drawPoints, drawBeelines, drawCurveLines } = this

      // 参数
      const { ctx, canvasWH, enhance, drawData, lineClosedStatus } = this

      // 擦除画布
      ctx.clearRect(0, 0, canvasWH.width, canvasWH.height)

      // 获取增强元素状态
      const { pointsStatus, beelinesStatus, curvesStatus } = enhance

      // 绘制 绘制点
      pointsStatus && drawPoints(drawData)

      // 绘制 绘制点连线
      beelinesStatus && drawBeelines(drawData, lineClosedStatus)

      // 绘制 绘制点平滑线
      curvesStatus && drawCurveLines(drawData, lineClosedStatus)

      // 方法
      const { drawLinesMiddlePoints, drawMiddlePointsLines } = this

      // 获取增强元素状态
      const { linesMiddlePointsStatus, middlePointsLinesStatus } = enhance

      // 绘制 绘制点连线中点
      linesMiddlePointsStatus && drawLinesMiddlePoints(drawData, lineClosedStatus)

      // 绘制 绘制点连线中点连线
      middlePointsLinesStatus && drawMiddlePointsLines(drawData, lineClosedStatus)
    },
    /**
     * @description                 绘制 绘制点
     * @param      {[{x, y}, ...]}  点数据集 每个元素都是包涵点坐标的对象 {Array}
     * @return     {undefined}      无返回值
     */
    drawPoints (points) {
      // 方法
      const { drawPoint } = this

      // 参数
      const { pointsRadius, color: { pointsColor } } = this

      points.map(({ x, y }) => {
        const point = { x, y, radius: pointsRadius, color: pointsColor }

        drawPoint(point)
      })
    },
    /**
     * @description                         绘制原点
     * @param      {{x, y, radius, color}}  绘制球点坐标 位置 半径 颜色
     * @return     {undefined}              无返回值
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
     * @description                 绘制 点连线
     * @param      {[{x, y}, ...]}  绘制点集 {Array} {[Int, Int]} 每个元素都是包涵点坐标的对象
     * @param      {closed}         线段是否闭合 {Boolean}
     * @param      {color}          线段颜色 {String}
     * @return     {undefined}      无返回值
     */
    drawBeelines (points, closed = false, color = false) {
      // 方法
      const { drawBeeline } = this

      // 参数
      const { lineWidth, color: { beelinesColor } } = this

      const { length: pointsNum } = points

      points.map((point, index) => {
        if (index === pointsNum - 1) return false

        const lineBegin = point
        const lineEnd = points[index + 1]

        drawBeeline(lineBegin, lineEnd, lineWidth, color || beelinesColor)
      })

      closed && drawBeeline(points[pointsNum - 1], points[0], lineWidth, color || beelinesColor)
    },
    /**
     * @description             绘制 点连线
     * @param      {{x, y}}     线段起始点 {Object} {{Int, Int}}
     * @param      {{x, y}}     线段终止点
     * @param      {lineWidth}  线段宽度 {Int}
     * @param      {lineColor}  线段颜色 {String}
     * @return     {undefined}  无返回值
     */
    drawBeeline ({x: bx, y: by}, {x: ex, y: ey}, lineWidth = 3, lineColor = '#000') {
      const { ctx } = this

      ctx.beginPath()

      ctx.moveTo(bx, by)
      ctx.lineTo(ex, ey)

      ctx.closePath()

      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor
      ctx.stroke()
    },
    /**
     * @description             绘制连线中点 点标记
     * @param      {[{x, y}]}   绘制点集 {Array} {[{Int, Int}]}
     * @param      {closed}     中点连线是否闭合 {Boolean}
     * @return     {undefined}  无返回值
     */
    drawLinesMiddlePoints (points, closed = false) {
      // 方法
      const { calcLinesMiddlePoints, drawPoint } = this

      const middlePoints = calcLinesMiddlePoints(points, closed)

      // 参数
      const { middlePointsRadius: radius, color: { linesMiddlePointsColor: color } } = this

      middlePoints.map(point => {
        drawPoint({
          ...point,
          radius,
          color
        })
      })
    },
    /**
     * @description                 获取线段中点
     * @param      {[{x, y}, ...]}  绘制点集 {Array} {[{Int, Int}]}
     * @param      {closed}         中点连线是否闭合 {Boolean}
     * @return     {[{x, y}, ...]}  中点集 {Array} {[{Int, Int}]}
     */
    calcLinesMiddlePoints (points, closed = false) {
      // 方法
      const { calcLineMiddlePoint } = this

      const { length: pointsNum } = points

      const middlePoints = points.map((point, index) => {
        if (index === pointsNum - 1) return false

        const lineBegin = point
        const lineEnd = points[index + 1]

        return calcLineMiddlePoint(lineBegin, lineEnd)
      })

      middlePoints.splice(middlePoints.length - 1, 1)

      closed && middlePoints.push(calcLineMiddlePoint(points[pointsNum - 1], points[0]))

      return middlePoints
    },
    /**
     * @description          获取线段中点
     * @param      {{x. y}}  起始点坐标信息
     * @param      {{x. y}}  终止点坐标信息
     * @return     {{x, y}}  中点数据
     */
    calcLineMiddlePoint ({x: bx, y: by}, {x: ex, y: ey}) {
      return {
        x: (bx + ex) / 2,
        y: (by + ey) / 2
      }
    },
    /**
     * @description                 绘制 绘制点中点连线
     * @param      {[{x, y}, ...]}  绘制点集
     * @param      {closed}         线段图形是否闭合
     * @return     {undefined}      无返回值
     */
    drawMiddlePointsLines (points, closed = false) {
      // 方法
      const { drawBeelines, calcLinesMiddlePoints } = this

      const { color: { middlePointsLinesColor } } = this

      const middlePoints = calcLinesMiddlePoints(points, closed)

      drawBeelines(middlePoints, closed, middlePointsLinesColor)
    },
    /**
     * @description            绘制曲线
     * @return    {undefined}  无返回值
     */
    drawCurveLines () {
    },
    /**
     * @description             绘制贝塞尔曲线
     * @return     {undefined}  无返回值
     */
    drawCurveLine () {
    },
    /**
     * @description             重新绘制
     * @return     {undefined}  无返回值
     */
    reDraw () {
      const { draw } = this

      this.drawData = []

      this.lineClosedStatus = false

      draw()
    },
    /**
     * @description             切换绘制元素显示与隐藏状态
     * @param      {key}        切换的元素状态键值 {String}
     * @return     {undefined}  无返回值
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
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    line-height: 50px;

    & > div, & > input {
      width: 100px;
      text-align: center;
      box-shadow: 0 0 3px gray;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 0 3px #f06183;
      }
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
