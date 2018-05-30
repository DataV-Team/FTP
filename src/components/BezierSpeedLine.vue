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

      canvasWH: {
        width: 0,
        height: 0
      },

      ccp: {
        x: 860,
        y: 1090
      },
      lcp: {
        x: 900,
        y: -900
      }
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
    vm.canvasWH.heigh = height

    // 设置canvas绘制区域大小
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)

    ctx.moveTo(0, 0)

    ctx.bezierCurveTo(vm.ccp.x, vm.ccp.y, vm.lcp.x, vm.lcp.y, 1000, 1000)

    ctx.lineWidth = 6

    ctx.stroke()

    vm.draw()
  }
}
</script>

<style lang="less">
  #test-container {
    width: 100%;
    height: auto;
    canvas {
      width: 500px;
      height: 500px;
      box-shadow: 0 0 3px gray;
    }
  }
</style>
