<template>
  <div id="test-container">
    <canvas id="test"></canvas>
  </div>
</template>

<script>
export default {
  data () {
    return {
      canvas: {},
      ctx: {},
      // canvas宽高
      canvasWH: {
        width: 0,
        height: 0
      },
      // 线段数据
      begin: {
        mp: {
          x: 0,
          y: 0
        },
        ccp: {
          x: 0,
          y: 0
        }
      },
      end: {
        mp: {
          x: 0,
          y: 0
        },
        lcp: {
          x: 0,
          y: 0
        }
      },
      // 判断击中哪个控制点
      clickStatus: false,
      // 线条宽度
      lineWidth: 5,
      // 控制点半径
      ctrlPointRadius: 20,
      // 颜色
      redColor: '#f06183',
      blueColor: '#00a1e4',
      greenColor: '#69d2cd',
      yellowColor: '#fed368',
      grayColor: 'rgba(180, 180, 180, 0.5)'
    }
  },
  methods: {
    // 绘制线段
    drawLine (move, to, width = 2, color = '#00a1e4') {
      let { ctx } = this

      ctx.beginPath()

      ctx.moveTo(move.x, move.y)
      ctx.lineTo(to.x, to.y)

      ctx.closePath()

      ctx.lineWidth = width
      ctx.strokeStyle = color
      ctx.stroke()
    },
    // 绘制圆点
    drawPoints (points, radius = 10, color = '#00a1e4') {
      let { ctx } = this

      ctx.beginPath()

      ctx.arc(points.x, points.y, radius, 0, Math.PI * 2)

      ctx.closePath()

      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.fill()
      ctx.stroke()
    },
    // 获取贝塞尔曲线时间t相关点坐标
    getBezierTimePoint (begin, end, t) {
      return {
        x: this.getBezierTimeSinglePoint(begin, end, t, 'x'),
        y: this.getBezierTimeSinglePoint(begin, end, t, 'y')
      }
    },
    // 获取贝塞尔曲线上的单点单坐标
    getBezierTimeSinglePoint (begin, end, t, type) {
      // 三次贝塞尔函数求时间t相关点坐标
      return (begin.mp[type] * Math.pow(1 - t, 3)) +
      (3 * (begin.ccp ? begin.ccp[type] : begin.mp[type]) * t * Math.pow(1 - t, 2)) +
      (3 * (end.lcp ? end.lcp[type] : end.mp[type]) * Math.pow(t, 2) * (1 - t)) +
      (end.mp[type] * Math.pow(t, 3))
    },
    // 两点式求直线上任意Y坐标点坐标
    getTwoPointsLineXpos (pointOne, pointTwo, y) {
      return {
        x: (y - pointOne.y) / (pointTwo.y - pointOne.y) * (pointTwo.x - pointOne.x) + pointOne.x,
        y
      }
    },
    // 转换点数据 将坐标系原点调整至左下角
    tranPointsPos (points) {
      let { canvasWH } = this

      return {
        x: points.x,
        y: canvasWH.height - points.y
      }
    },
    // 绘制速度与时间曲线图
    drawSpeedTimeLine () {
      let { ctx, canvasWH, begin, end, lineWidth, grayColor, greenColor, redColor, yellowColor, ctrlPointRadius } = this

      ctx.clearRect(0, 0, canvasWH.width, canvasWH.height)

      // 绘制标准K线  (K = 1时)
      this.drawLine(begin.mp, end.mp, lineWidth, grayColor)

      // 绘制上下标准边界
      let spaceHeight = (canvasWH.height - canvasWH.width) / 2
      let bottomHeight = spaceHeight + canvasWH.width
      this.drawLine({x: 0, y: spaceHeight}, {x: canvasWH.width, y: spaceHeight}, lineWidth, grayColor)
      this.drawLine({x: 0, y: bottomHeight}, {x: canvasWH.width, y: bottomHeight}, lineWidth, grayColor)

      // 绘制bezier速度与时间曲线
      ctx.beginPath()
      ctx.moveTo(begin.mp.x, begin.mp.y)
      ctx.bezierCurveTo(begin.ccp.x, begin.ccp.y, end.lcp.x, end.lcp.y, end.mp.x, end.mp.y)

      ctx.lineWidth = lineWidth
      ctx.strokeStyle = greenColor
      ctx.stroke()
      ctx.closePath()

      // 绘制根点与手柄点之间连线
      this.drawLine(begin.mp, begin.ccp, 3, grayColor)
      this.drawLine(end.mp, end.lcp, 3, grayColor)

      // 绘制手柄点
      this.drawPoints(begin.ccp, ctrlPointRadius, redColor)
      this.drawPoints(end.lcp, ctrlPointRadius, yellowColor)
    },
    // 获取鼠标真实位置
    getMouseTruePos (e) {
      return {
        x: e.offsetX * 2,
        y: e.offsetY * 2
      }
    },
    // 计算两点间距离
    calcTwoPointsDistance (pointOne, pointTwo) {
      let absX = Math.abs(pointOne.x - pointTwo.x)
      let absY = Math.abs(pointOne.y - pointTwo.y)
      return Math.sqrt(Math.pow(absX, 2) + Math.pow(absY, 2))
    },
    // 计算是否击中圆内
    calcClickIsInCircle (circle, click) {
      if (this.calcTwoPointsDistance(circle, click) > circle.radius) return false
      return true
    },
    // mousedown行为
    mouseDown (e) {
      let { canvas, begin, end } = this

      let mouse = this.getMouseTruePos(e)

      let ccpCircle = {
        ...begin.ccp,
        radius: 30
      }

      let lcpCircle = {
        ...end.lcp,
        radius: 30
      }

      this.clickStatus = false

      if (this.calcClickIsInCircle(ccpCircle, mouse)) {
        this.clickStatus = 'ccp'
      } else if (this.calcClickIsInCircle(lcpCircle, mouse)) {
        this.clickStatus = 'lcp'
      }

      if (this.clickStatus) {
        canvas.addEventListener('mousemove', this.mouseMove)
      }
    },
    // mouseup行为
    mouseUp () {
      let { canvas } = this

      if (this.clickStatus) canvas.removeEventListener('mousemove', this.mouseMove)

      this.clickStatus = false
    },
    mouseMove (e) {
      let { begin, end } = this

      let mouse = this.getMouseTruePos(e)

      if (this.clickStatus === 'ccp') {
        begin.ccp = mouse
      } else if (this.clickStatus === 'lcp') {
        end.lcp = mouse
      }

      this.drawSpeedTimeLine()
    },
    // 计算点坐标使只居中
    calcPointsPosMiddle () {
      let { canvasWH, begin, end } = this

      let spaceHeight = (canvasWH.height - canvasWH.width) / 2

      begin.mp.y = begin.ccp.y = spaceHeight

      end.mp.x = end.lcp.x = canvasWH.width
      end.mp.y = end.lcp.y = canvasWH.width + spaceHeight
    },
    // 初始化绘制坐标
    initPointsPos () {
      let { begin, end } = this

      // 转换点坐标系原点位置至左下角
      begin.mp = this.tranPointsPos(begin.mp)
      begin.ccp = this.tranPointsPos(begin.ccp)
      end.mp = this.tranPointsPos(end.mp)
      end.lcp = this.tranPointsPos(end.lcp)
    },
    // test
    draw () {
      let begin = {
        mp: {
          x: 0,
          y: 0
        },
        ccp: this.ccp
      }
      let end = {
        mp: {
          x: 1000,
          y: 1000
        },
        lcp: this.lcp
      }

      let pOne = this.getBezierTimePoint(begin, end, 0.5)
      let pTwo = this.getBezierTimePoint(begin, end, 0.49999)
      this.drawPoints(pOne, 4, '#fed368')

      let rayPointOne = this.getTwoPointsLineXpos(pOne, pTwo, 0)
      let rayPointTwo = this.getTwoPointsLineXpos(pOne, pTwo, 1000)

      this.drawLine(rayPointOne, rayPointTwo, 2, '#c03264')

      this.drawPoints(begin.ccp, 30)
    }
  },
  mounted () {
    let vm = this

    let canvas = document.querySelector('#test')
    let ctx = canvas.getContext('2d')

    vm.canvas = canvas
    vm.ctx = ctx

    // 获取canvasDOM宽高 并放大两倍 减少画面模糊
    let width = canvas.clientWidth * 2
    let height = canvas.clientHeight * 2

    // 缓存canvas绘制区域宽高
    vm.canvasWH.width = width
    vm.canvasWH.height = height

    // 设置canvas绘制区域大小
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)

    vm.calcPointsPosMiddle()

    vm.initPointsPos()

    vm.drawSpeedTimeLine()

    canvas.addEventListener('mousedown', vm.mouseDown)
    canvas.addEventListener('mouseup', vm.mouseUp)
  }
}
</script>

<style lang="less">
  #test-container {
    width: 100%;
    height: 100%;
    canvas {
      width: 300px;
      height: calc(~"100% - 80px");
      box-shadow: 0 0 3px gray;
      margin-left: 30px;
      margin-top: 5px;
    }
  }
</style>
