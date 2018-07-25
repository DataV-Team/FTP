<template>
  <div id="points-to-smooth-line">
    <div class="action">
      <div class="red" @click="reDraw">reDraw</div>
      <input type="text" v-model="kValue" placeholder="K">
      <div :class="{red: enhance.pointsStatus}"
        @click="changeDrawStatus('pointsStatus')">Points</div>
      <div :class="{red: enhance.beelinesStatus}"
        @click="changeDrawStatus('beelinesStatus')">beeline</div>
      <div :class="{red: enhance.linesMiddlePointsStatus}"
        @click="changeDrawStatus('linesMiddlePointsStatus')">LMP</div>
      <div :class="{red: enhance.middlePointsLinesStatus}"
        @click="changeDrawStatus('middlePointsLinesStatus')">MPL</div>
      <div :class="{red: enhance.middlePointsLinesScalePointsStatus}"
        @click="changeDrawStatus('middlePointsLinesScalePointsStatus')">MPLSP</div>
      <div :class="{red: enhance.transformedScalePointsStatus}"
        @click="changeDrawStatus('transformedScalePointsStatus')">TSP</div>
      <div :class="{red: enhance.transformedScalePointsConnectLinesStatus}"
        @click="changeDrawStatus('transformedScalePointsConnectLinesStatus')">TSPL</div>
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
        middlePointsLinesStatus: true,
        // 绘制点中点连线的对应边比例点显示状态
        middlePointsLinesScalePointsStatus: true,
        // 绘制点中点连线的对应边比例点位移至顶点的点的显示状态
        transformedScalePointsStatus: true,
        // 绘制点中点连线的对应边比例点位移至顶点的点与顶点连线的显示状态
        transformedScalePointsConnectLinesStatus: true
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
        // 绘制点中点连线的对应边比例点颜色 红色
        middlePointsLinesScalePointsColor: '#f06183',
        // 绘制点中点连线的对应边比例点位移至顶点的点的颜色 绿色
        transformedScalePointsColor: '#69d2cd',
        // 曲线颜色 绿色
        curvesColor: '#69d2cd'
      },
      // 贝塞尔曲线锐利程度K值
      kValue: 1,

      // 配置项

      // 球点半径
      pointsRadius: 15,
      // 中点球点半径
      middlePointsRadius: 7,
      // 绘制点中点连线的对应边比例点的半径
      middlePointsLinesScalePointsRadius: 7,
      // 绘制点中点连线的对应边比例点位移至顶点的点的半径
      transformedScalePointsRadius: 4,
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

      {
        // 参数
        const { pointsRadius: radius, color: { pointsColor: color } } = this

        const config = {
          radius,
          color
        }

        // 绘制 绘制点
        pointsStatus && drawPoints(drawData, config)
      }

      // 绘制 绘制点连线
      beelinesStatus && drawBeelines(drawData, lineClosedStatus)

      // 绘制 绘制点平滑线
      curvesStatus && drawCurveLines(drawData, lineClosedStatus)

      // 方法
      const { drawLinesMiddlePoints, drawMiddlePointsLines, drawMiddlePointsLinesScalePoints } = this

      // 获取增强元素状态
      const { linesMiddlePointsStatus, middlePointsLinesStatus, middlePointsLinesScalePointsStatus } = enhance

      // 绘制 绘制点连线中点
      linesMiddlePointsStatus && drawLinesMiddlePoints(drawData, lineClosedStatus)

      // 绘制 绘制点连线中点连线
      middlePointsLinesStatus && drawMiddlePointsLines(drawData, lineClosedStatus)

      // 绘制 绘制点连线中点连线的对应边比例点
      middlePointsLinesScalePointsStatus && drawMiddlePointsLinesScalePoints(drawData, lineClosedStatus)

      // 方法
      const { drawTransformedScalePoints, drawTransformedScalePointsConnectLines } = this

      // 获取增强元素状态
      const { transformedScalePointsStatus, transformedScalePointsConnectLinesStatus } = enhance

      // 绘制点中点连线的对应边比例点位移至顶点的点
      transformedScalePointsStatus && drawTransformedScalePoints(drawData, lineClosedStatus)

      // 绘制点中点连线的对应边比例点位移至顶点的点与顶点的连线
      transformedScalePointsConnectLinesStatus && drawTransformedScalePointsConnectLines(drawData, lineClosedStatus)
    },
    /**
     * @description                 绘制 绘制点
     * @param      {[{x, y}, ...]}  点数据集 每个元素都是包涵点坐标的对象 {Array}
     * @param      {radius, color}  绘制球点配置项 球点半径及填充色
     * @return     {undefined}      无返回值
     */
    drawPoints (points, {radius = 10, color = '#000'}) {
      if (!points.length) return false
      // 方法
      const { drawPoint } = this

      points.map(({ x, y }) => {
        const point = { x, y, radius, color }

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
      if (!points.length) return false
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
      if (!points.length) return false
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
      if (!points.length) return false
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
      if (!points.length) return false
      // 方法
      const { drawBeelines, calcLinesMiddlePoints } = this

      const { color: { middlePointsLinesColor } } = this

      const middlePoints = calcLinesMiddlePoints(points, closed)

      drawBeelines(middlePoints, closed, middlePointsLinesColor)
    },
    /**
     * @description                 绘制 绘制点中点连线的对应边的比例点
     * @param      {[{x, y}, ...]}  绘制点集 {[{Int, Int}, ...]}
     * @param      {closed}         绘制线段是否闭合 {boolean}
     * @return     {undefined}      无返回值
     */
    drawMiddlePointsLinesScalePoints (points, closed = false) {
      if (points.length < 3) return false

      const { calcMiddlePointsLinesScalePoints, drawPoints } = this

      const middlePointsLinesScalePoints = calcMiddlePointsLinesScalePoints(points, closed)

      // 参数
      const { middlePointsLinesScalePointsRadius: radius,
        color: { middlePointsLinesScalePointsColor: color } } = this

      const config = {
        radius,
        color
      }

      drawPoints(middlePointsLinesScalePoints, config)
    },
    /**
     * @description                 获取 绘制点中点连线的对应边的比例点
     * @param      {[{x, y}, ...]}  绘制点集 {[{Int, Int}, ...]}
     * @param      {closed}         绘制线段是否闭合 {boolean}
     * @return     {[{x, y}, ...]}  计算结果点集
     */
    calcMiddlePointsLinesScalePoints (points, closed = false) {
      if (points.length < 3) return false

      // 方法
      const { calcMiddlePointLineScalePoint } = this

      const { lineClosedStatus } = this

      const { length: pointsNum } = points

      const middlePointsLinesScalePoints = points.map((point, index) => {
        if (index > pointsNum - 3) return false

        return calcMiddlePointLineScalePoint([
          point,
          points[index + 1],
          points[index + 2]
        ])
      })

      middlePointsLinesScalePoints.splice(pointsNum - 2, 2)

      lineClosedStatus && middlePointsLinesScalePoints.push(calcMiddlePointLineScalePoint([
        points[pointsNum - 2],
        points[pointsNum - 1],
        points[0]
      ])) && middlePointsLinesScalePoints.push(calcMiddlePointLineScalePoint([
        points[pointsNum - 1],
        points[0],
        points[1]
      ]))

      return middlePointsLinesScalePoints
    },
    /**
     * @description                  获取 绘制点中点连线的对应边的比例点
     * @param      {[{x, y}, ...3]}  主线 点坐标 共三个点 {[{Int, Int}, ...3]}
     * @return     {{x, y}}          计算结果点坐标
     */
    calcMiddlePointLineScalePoint ([lineBegin, lineMiddle, lineEnd]) {
      const { calcLineMiddlePoint, calcTwoPointsDistance, calcTwoPointsTypeBeelinePointPosByXPos } = this

      // 计算两个中点坐标
      const middlePointsLineBegin = calcLineMiddlePoint(lineBegin, lineMiddle)
      const middlePointsLineEnd = calcLineMiddlePoint(lineMiddle, lineEnd)

      // 计算两个主线长度
      const mainLineBeginLength = calcTwoPointsDistance(lineBegin, lineMiddle)
      const mainLineEndLength = calcTwoPointsDistance(lineMiddle, lineEnd)

      // 计算中点的X坐标差值
      const middlePointsMinusX = middlePointsLineEnd.x - middlePointsLineBegin.x

      // 计算起始主线占主线总长度百分比
      const mainLineBeginLengthInTotalPercent = mainLineBeginLength / (mainLineBeginLength + mainLineEndLength)

      // 根据相似三角形等比关系计算比例点X坐标
      const scalePointXPos = middlePointsLineBegin.x + (mainLineBeginLengthInTotalPercent * middlePointsMinusX)

      return calcTwoPointsTypeBeelinePointPosByXPos([
        middlePointsLineBegin,
        middlePointsLineEnd
      ], scalePointXPos)
    },
    /**
     * @description                    通过X坐标计算两点式直线方程上的一点完整点坐标
     * @param      {[{x, y}, {x, y}]}  直线方程上两点 {[{Int, Int}, {Int, Int}]}
     * @param      {xPos}              被求点坐标的X坐标 {Int}
     * @return     {{x, y}}            被求点 完整点坐标
     */
    calcTwoPointsTypeBeelinePointPosByXPos ([{x: bx, y: by}, {x: ex, y: ey}], xPos) {
      return {
        x: xPos,
        y: (xPos - bx) / (ex - bx) * (ey - by) + by
      }
    },
    /**
     * @description                 绘制点中点连线的对应边比例点位移至顶点的点
     * @param      {[{x, y}, ...]}  绘制点集 {[{Int, Int}, ...]}
     * @param      {closed}         绘制线段是否闭合 {boolean}
     * @return     {undefined}      无返回值
     */
    drawTransformedScalePoints (points, closed = false) {
      const { calcTransformedScalePoints, drawPoints } = this

      const transformedScalePoints = calcTransformedScalePoints(points, closed)

      const { transformedScalePointsRadius: radius, color: { transformedScalePointsColor: color } } = this

      const config = {
        radius,
        color
      }

      drawPoints(transformedScalePoints, config)
    },
    /**
     * @description                 计算绘制点中点等比例位移至顶点的点集
     * @param      {[{x, y}, ...]}  绘制点集 {[{Int, Int}, ...]}
     * @param      {closed}         绘制线段是否闭合 {boolean}
     * @return     {[{x, y}, ...]}  结果点集
     */
    calcTransformedScalePoints (points, closed = false) {
      if (points.length < 3) return false

      const { calcLinesMiddlePoints, calcMiddlePointsLinesScalePoints, calcTransformedScalePointsPosition } = this

      const middlePoints = calcLinesMiddlePoints(points, closed)
      const scalePoints = calcMiddlePointsLinesScalePoints(points, closed)

      const { length: pointsNum } = points

      const transformedScalePoints = []

      points.map((point, index) => {
        if (!index || index === pointsNum - 1) return false

        const params = [
          middlePoints[index - 1],
          middlePoints[index],
          scalePoints[index - 1],
          point
        ]

        transformedScalePoints.push(...calcTransformedScalePointsPosition(params))
      })

      closed && transformedScalePoints.push(...calcTransformedScalePointsPosition([
        middlePoints[pointsNum - 2],
        middlePoints[pointsNum - 1],
        scalePoints[pointsNum - 2],
        points[pointsNum - 1]
      ])) && transformedScalePoints.push(...calcTransformedScalePointsPosition([
        middlePoints[pointsNum - 1],
        middlePoints[0],
        scalePoints[pointsNum - 1],
        points[0]
      ])) && console.error('yes')

      return transformedScalePoints
    },
    /**
     * @description                  计算绘制点中点等比例位移至顶点的点集
     * @param      {[{x, y}, ...4]}  数组内包含四个点坐标对象 起始中点 结束中点 中点上的比例点 基准顶点 {[{Int. Int}, ...4]}
     * @return     {[{x, y}, ...2]}  两个中点位移后的点坐标信息 以数组为容器包裹抛出
     */
    calcTransformedScalePointsPosition ([{x: bx, y: by}, {x: ex, y: ey}, {x: sx, y: sy}, {x: mx, y: my}]) {
      const minusX = mx - sx
      const minusY = my - sy

      const transformedPointB = {
        x: bx + minusX,
        y: by + minusY
      }

      const transformedPointE = {
        x: ex + minusX,
        y: ey + minusY
      }

      const { kValue } = this

      const { calcAfterKPointsPosition } = this

      return calcAfterKPointsPosition({x: mx, y: my}, kValue, [transformedPointB, transformedPointE])
    },
    /**
     * @description                 计算点以另一点为中心 按K值缩放后的点坐标
     * @param      {{x, y}}         中心点位置
     * @param      {kValue}         K值
     * @param      {[{x, y}, ...]}  被计算点坐标集 以数组为容器 每一个元素都是一个点坐标信息对象
     * @return     {[{x, y}, ...]}  被计算点坐标结果集 以数组为容器 每一个元素都是一个点坐标信息对象
     */
    calcAfterKPointsPosition ({x: mx, y: my}, kValue, points) {
      return points.map(({x, y}) => {
        return {
          x: ((x - mx) * kValue) + mx,
          y: ((y - my) * kValue) + my
        }
      })
    },
    /**
     * @description                 获取 绘制点中点连线的对应边的比例点
     * @param      {[{x, y}, ...]}  绘制点集 {[{Int, Int}, ...]}
     * @param      {closed}         绘制线段是否闭合 {boolean}
     * @return     {undefined}      无返回值
     */
    drawTransformedScalePointsConnectLines (points, closed = false) {
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
