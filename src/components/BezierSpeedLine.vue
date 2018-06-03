<template>
  <div id="test-container">
    <canvas id="bezier-speed-line"></canvas>
    <div class="line-perform">
      <div class="line-info">
        Current-Bezier-Line(
          <input type="number" v-model="bezierLinePoints.ccpx" @change="setBezierLinePoints">,
          <input type="number" v-model="bezierLinePoints.ccpy" @change="setBezierLinePoints">,
          <input type="number" v-model="bezierLinePoints.lcpx" @change="setBezierLinePoints">,
          <input type="number" v-model="bezierLinePoints.lcpy" @change="setBezierLinePoints">
        )
      </div>
      <div class="k-value">
        T-K-Relation(T=
          <input type="number" v-model="bezierLineT" @change="drawLineTK">,
          K= {{ bezierLineK }}
        )
      </div>
      <div class="animation-time">
        AnimationTime =
        <input type="number" v-model="animationTime"> S
        <span @click="moveBox">Play Again</span>
      </div>
      <div class="line-speed">
        <div id="speed-item"></div>
      </div>
    </div>
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
      grayColor: 'rgba(180, 180, 180, 0.5)',
      // 展示数据
      bezierLinePoints: {
        ccpx: 0,
        ccpy: 0,
        lcpx: 0,
        lcpy: 0
      },
      // 贝塞尔函数t时刻
      bezierLineT: 0,
      // 贝塞尔函数t时刻k值
      bezierLineK: 0,
      // 动画时间
      animationTime: 3,
      // 播放动画的容器DOM
      lineSpeedBox: {},
      // 播放动画的方块
      speedItem: {},
      // 方块位置数据
      itemData: {
        left: 10
      },
      // 是否可以播放动画
      animationStatus: true,
      // 每一帧的时间 ms
      frameTime: 10
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
    // mousemove行为
    mouseMove (e) {
      let { begin, end, bezierLineT } = this

      let mouse = this.getMouseTruePos(e)

      if (this.clickStatus === 'ccp') {
        begin.ccp = mouse
      } else if (this.clickStatus === 'lcp') {
        end.lcp = mouse
      }

      this.tranShowPointsData()

      this.drawSpeedTimeLine()

      if (bezierLineT) this.drawLineTK()
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
    // 转换展示数据至真实数据
    tranShowPointsData () {
      let { begin, end, bezierLinePoints, canvasWH } = this

      let ccp = this.tranPointsPos(begin.ccp)
      let lcp = this.tranPointsPos(end.lcp)

      let scale = 1 / canvasWH.width
      let minusH = (canvasWH.height - canvasWH.width) / 2

      bezierLinePoints.ccpx = (ccp.x * scale).toFixed(3)
      bezierLinePoints.ccpy = ((ccp.y - minusH) * scale).toFixed(3)
      bezierLinePoints.lcpx = (lcp.x * scale).toFixed(3)
      bezierLinePoints.lcpy = ((lcp.y - minusH) * scale).toFixed(3)
    },
    // 设置控制点
    setBezierLinePoints () {
      let { begin, end, bezierLinePoints, canvasWH, bezierLineT } = this

      let ccp = {
        x: bezierLinePoints.ccpx,
        y: bezierLinePoints.ccpy
      }
      let lcp = {
        x: bezierLinePoints.lcpx,
        y: bezierLinePoints.lcpy
      }

      let scale = canvasWH.width
      let minusH = (canvasWH.height - canvasWH.width) / 2

      ccp.x = ccp.x * scale
      ccp.y = ccp.y * scale + minusH
      lcp.x = lcp.x * scale
      lcp.y = lcp.y * scale + minusH

      ccp = this.tranPointsPos(ccp)
      lcp = this.tranPointsPos(lcp)

      begin.ccp = ccp
      end.lcp = lcp

      this.drawSpeedTimeLine()

      if (bezierLineT) this.drawLineTK()
    },
    // 绘制贝塞尔曲线t时刻的K线
    drawLineTK () {
      let { begin, end, bezierLineT, canvasWH, blueColor, redColor } = this

      this.drawSpeedTimeLine()

      let pOne = this.getBezierTimePoint(begin, end, bezierLineT)
      let pTwo = this.getBezierTimePoint(begin, end, bezierLineT - 0.00001)

      // 绘制切线点
      this.drawPoints(pOne, 4, blueColor)

      let rayPointOne = this.getTwoPointsLineXpos(pOne, pTwo, 0)
      let rayPointTwo = this.getTwoPointsLineXpos(pOne, pTwo, canvasWH.height)

      // 绘制切线
      this.drawLine(rayPointOne, rayPointTwo, 2, redColor)

      // 求k
      this.bezierLineK = ((pTwo.y - pOne.y) / (pTwo.x - pOne.x)).toFixed(3) * -1
    },
    // *************************************************
    // 计算K值
    calcBezierTK (ccp, lcp, t) {
      let begin = {
        mp: {
          x: 0,
          y: 0
        },
        ccp
      }
      let end = {
        mp: {
          x: 1,
          y: 1
        },
        lcp
      }

      let pOne = this.getBezierTimePoint(begin, end, t)
      let pTwo = this.getBezierTimePoint(begin, end, t - 0.00001)

      return ((pTwo.y - pOne.y) / (pTwo.x - pOne.x)).toFixed(3)
    },
    // 播放动画
    playBezierSpeedAnimation (pOne, pTwo, value, toValue, t, callback, roundNum = 1) {
      // 每帧绘制时间间隔
      let { frameTime } = this

      // 绘制完成一共需要多少帧
      let drawNum = Math.ceil(t * 1000 / frameTime)

      // 变化总值
      let changeArea = toValue - value

      // 当前t值
      let curTime = roundNum / drawNum

      let pointOne = {
        mp: {
          x: 0,
          y: 0
        },
        ccp: pOne
      }

      let pointTwo = {
        mp: {
          x: 1,
          y: 1
        },
        lcp: pTwo
      }
      // 当前t曲线上的点
      let curBezierLinePoint = this.getBezierTimePoint(pointOne, pointTwo, curTime)

      let curValue = (changeArea * curBezierLinePoint.y) + value

      if (typeof (callback) === 'function') callback(curValue)

      if (roundNum === drawNum) {
        this.animationStatus = true
        return false
      }

      roundNum++

      let vm = this

      setTimeout(() => {
        vm.playBezierSpeedAnimation(pOne, pTwo, value, toValue, t, callback, roundNum, curValue)
      }, frameTime)
    },
    // 移动方块
    moveBox () {
      let { lineSpeedBox, speedItem, bezierLinePoints, itemData, animationTime, animationStatus } = this

      if (!animationStatus) return false

      this.animationStatus = false

      itemData.left = 10
      speedItem.style.left = '10px'

      let endPos = lineSpeedBox.clientWidth - 65

      let pOne = {
        x: bezierLinePoints.ccpx,
        y: bezierLinePoints.ccpy
      }
      let pTwo = {
        x: bezierLinePoints.lcpx,
        y: bezierLinePoints.lcpy
      }

      this.playBezierSpeedAnimation(pOne, pTwo, itemData.left, endPos, animationTime, this.play)
    },
    // 移动方块位置
    play (value) {
      let { itemData, speedItem } = this

      itemData.left = value

      speedItem.style.left = value + 'px'
    }
  },
  created () {
  },
  mounted () {
    let vm = this

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

    // 缓存canvas绘制区域宽高
    vm.canvasWH.width = width
    vm.canvasWH.height = height

    // 设置canvas绘制区域大小
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)

    vm.calcPointsPosMiddle()

    vm.initPointsPos()

    vm.tranShowPointsData()

    vm.drawSpeedTimeLine()

    canvas.addEventListener('mousedown', vm.mouseDown)
    canvas.addEventListener('mouseup', vm.mouseUp)
  }
}
</script>

<style lang="less">
  #test-container {
    display: flex;
    width: 100%;
    height: calc(~"100% - 70px");
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: stretch;
    canvas {
      width: 300px;
      box-shadow: 0 0 3px gray;
      margin-left: 30px;
    }
    .line-perform {
      box-shadow: 0 0 3px gray;
      flex-grow: 1;
      margin-left: 30px;
      display: flex;
      flex-direction: column;
      .line-info, .k-value, .animation-time {
        height: 50px;
        box-shadow: 0 0 3px gray;
        line-height: 50px;
        text-indent: 10px;
        font-size: 30px;
        color: #f06183;
        input {
          width: 50px;
          height: 30px;
          vertical-align: center;
          text-align: center;
          line-height: 30px;
          font-size: 20px;
        }
      }
      .k-value, .animation-time, .line-speed {
        margin-top: 10px;
      }
      .animation-time {
        span {
          display: inline-block;
          box-shadow: 0 0 3px #69d2cd;
          color: #69d2cd;
          cursor: pointer;
          text-indent: 0px;
          padding: 0px 10px;
          transition: all 0.3s;
          &:hover {
            color: #f06183;
          }
        }
      }
      .line-speed {
        position: relative;
        flex: 1;
        box-shadow: 0 0 3px gray;
        div {
          position: absolute;
          background-color: #f06183;
          width: 50px;
          height: 50px;
          left: 10px;
          top: 100px;
        }
      }
    }
  }
</style>
