import Vue from 'vue'
import Router from 'vue-router'

import hi from '../components/hi.vue'

import bezierSpeedLine from '../components/bezierSpeedLine.vue'
import drawBezierCurve from '../components/drawBezierCurve.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: {
        name: 'hi'
      }
    },
    {
      path: '/hi',
      name: 'hi',
      component: hi
    },
    {
      path: '/bezierSpeedLine',
      name: 'bezierSpeedLine',
      component: bezierSpeedLine
    },
    {
      path: '/drawBezierCurve',
      name: 'drawBezierCurve',
      component: drawBezierCurve
    }
  ]
})
