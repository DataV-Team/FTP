import Vue from 'vue'
import Router from 'vue-router'

import hi from '../components/hi.vue'

import BezierSpeedLine from '../components/BezierSpeedLine.vue'

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
      path: '/BezierSpeedLine',
      name: 'BezierSpeedLine',
      component: BezierSpeedLine
    }
  ]
})
